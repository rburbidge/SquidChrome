import { Injectable } from '@angular/core';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/timeout';
import 'rxjs/add/operator/toPromise';

import { ChromeAuthHelper } from '../../common/chrome-auth-helper';
import { Config } from '../../config';
import { Device } from '../../models/device';

/**
 * The device service.
 */
@Injectable()
export class DeviceService {
    private baseUrl: string = Config.squidEndpoint;
    private static timeoutMillis: number = 3000;

    constructor(private http: Http) { }

    public getDevices(): Promise<Device[]> {
        return this.sendAuthorizedRequest('/api/devices', { method: 'GET'} as RequestOptions)
            .then(response => response.json() as Device[]);
    }

    public sendUrlToDevice(deviceId: string): Promise<Response> {
        return this.sendAuthorizedRequest(`/api/devices/${deviceId}/commands`, { method: 'POST' } as RequestOptions)
    }

    private sendAuthorizedRequest<T>(relativePath: string, options: RequestOptions): Promise<Response> {
        return new Promise<Response>((resolve, reject) => {
            return ChromeAuthHelper.createAuthHeader()
                .then((authHeader: string) => {
                    if (!options.headers) {
                        options.headers = new Headers();
                    }

                    options.headers.append('Authorization', authHeader);

                    this.http.request(this.baseUrl + relativePath, options)
                        .timeout(DeviceService.timeoutMillis, new Error('timeout exceeded'))
                        .toPromise()
                        .then(resolve)
                        .catch(reject);
                });
            });   
    }
};