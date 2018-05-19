import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/timeout';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/observable/fromPromise';

import { Config } from '../../../config/config';
import { AddDeviceBody, ErrorCode, ErrorModel, Content, ContentType } from '../../../contracts/squid';
import { ChromeDeviceModel, convertDeviceModel, ChromeErrorModel } from './squid-converter';
import { SettingsService } from './settings.service';

/**
 * The squid service.
 */
@Injectable()
export class SquidService {
    private baseUrl: string = Config.squidEndpoint;

    constructor(private readonly http: HttpClient,
                private readonly settings: SettingsService) { }

    public addDevice(deviceInfo: AddDeviceBody): Promise<ChromeDeviceModel> {
        return this.sendRequest<ChromeDeviceModel>('POST', '/api/devices', deviceInfo)
            .then(device => convertDeviceModel(device));
    }

    public removeDevice(id: string): Promise<any> {
        return this.sendRequest('DELETE', `/api/devices/${id}`, undefined, 'text');
    }

    /**
     * Returns the user's devices. The devices are always refreshed, never cached.
     */
    public getDevices(): Promise<ChromeDeviceModel[]> {
        return this.sendRequest<ChromeDeviceModel[]>('GET', '/api/devices')
            .then(devices => devices.map(device => convertDeviceModel(device)));
    }

    /**
     * Returns the user's cached devices, if any. If the devices on the server differ, then emits again with the updated
     * devices.
     * 
     * Emits complete when finished.
     */
    public getDevicesCached(): Observable<ChromeDeviceModel[]> {
        return new Observable(observer => {
            if(this.settings.settings.devices) {
                observer.next(this.settings.settings.devices);
            }

            this.getDevices()
                .then(updatedDevices => {
                    // Emit updated devices only if updated differs from cache
                    if(JSON.stringify(this.settings.settings.devices) != JSON.stringify(updatedDevices)) {
                        return this.settings.setDevices(updatedDevices)
                            .then(() => {
                                observer.next(updatedDevices);
                                observer.complete();
                            });
                    } else {
                        observer.complete();
                    }
                })
                .catch(error => observer.error(error));
        });
    }

    /**
     * Sends URL content to the service.
     * @param originDeviceId This device's ID.
     * @param url The URL content to send.
     */
    public async sendUrl(originDeviceId: string, url: string) {
        const body: Content = {
            content: url,
            contentType: ContentType.url,
            originDeviceId: originDeviceId
        };
        await this.sendRequest('POST', `/squid/api/content`, body, 'text');
    }

    /**
     * Helper method to send requests to Squid Service.
     * @param method The HTTP request method.
     * @param relativePath The relative path to hit.
     * @param body The body to send, if any.
     * @param responseType The response type. Default is 'json'.
     */
    private sendRequest<T>(method: string, relativePath: string, body?: any, responseType?: string): Promise<T> {
        const headers = {
            'Cache-Control': 'no-cache',
        };
        if(body) {
            headers['Content-type'] = 'application/json';
        }

        const options: any = {
            headers: new HttpHeaders(headers)
        };
        if(body) {
            options.body = body;
        }
        if(responseType) {
            options.responseType = responseType;
        }

        return this.http.request<T>(method, this.baseUrl + relativePath, options).toPromise()
            .catch((response: any) => {
                if(response instanceof ChromeErrorModel) {
                    throw response;
                }

                let httpErrorResponse = response as HttpErrorResponse;

                // Resolve on 302. This indicates that a POST request resulted in no change in storage (e.g. Found)
                if(httpErrorResponse.status === 302) {
                    return response.error;
                }

                let error: ErrorModel;
                try {
                    if(httpErrorResponse.error.codeString) {
                        error = response.error;
                    }
                } catch(e) {
                    console.warn('Exception occurred when parsing error response JSON: ' + e);
                }

                // If the error is not defined, then construct a default error for the caller
                if(!error) {
                    error = new ChromeErrorModel(
                        ErrorCode.Unknown,
                        'Response contained an unknown error: ' + httpErrorResponse.error);
                }

                throw error;
            });
    }
};