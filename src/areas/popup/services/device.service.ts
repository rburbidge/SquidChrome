import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import 'rxjs/add/operator/timeout';
import 'rxjs/add/operator/toPromise';

import { Config } from '../../../config/config';
import { AddDeviceBody, CommandBody, DeviceModel, ErrorCode, ErrorModel, AuthHeader, createAuthHeader } from '../../../contracts/squid';
import { ChromeDeviceModel, convertDeviceModel, ChromeErrorModel } from './squid-converter';
import { ChromeService } from './chrome.service';

/**
 * The device service.
 */
@Injectable()
export class DeviceService {
    private baseUrl: string = Config.squidEndpoint;
    private static timeoutMillis: number = 3000;

    constructor(private readonly http: HttpClient,
                private readonly chrome: ChromeService) { }

    public addDevice(deviceInfo: AddDeviceBody): Promise<ChromeDeviceModel> {
        return this.sendRequest<ChromeDeviceModel>('POST', '/api/devices', deviceInfo)
            .then(device => convertDeviceModel(device));
    }

    public removeDevice(id: string): Promise<any> {
        return this.sendRequest('DELETE', `/api/devices/${id}`, undefined, 'text');
    }

    public getDevices(): Promise<ChromeDeviceModel[]> {
        return this.sendRequest<ChromeDeviceModel[]>('GET', '/api/devices')
            .then(devices => devices.map(device => convertDeviceModel(device)));
    }

    public sendUrl(id: string, url: string): Promise<any> {
        const body: CommandBody = {
            url: url
        };
        return this.sendRequest('POST', `/api/devices/${id}/commands`, body);
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
                    return response;
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