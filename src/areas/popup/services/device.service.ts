import { Injectable } from '@angular/core';
import { Headers, Http, Response, RequestOptions, RequestOptionsArgs } from '@angular/http';
import 'rxjs/add/operator/timeout';
import 'rxjs/add/operator/toPromise';

import { ChromeAuthHelper } from '../../common/chrome-auth-helper';
import { Config } from '../../../config/config';
import { AddDeviceBody, CommandBody, DeviceModel, ErrorCode, ErrorModel } from '../../../contracts/squid';

/**
 * The device service.
 */
@Injectable()
export class DeviceService {
    private baseUrl: string = Config.squidEndpoint;
    private static timeoutMillis: number = 3000;

    constructor(private http: Http) { }

    public addDevice(deviceInfo: AddDeviceBody): Promise<DeviceModel> {
        return this.sendAuthorizedRequest('/api/devices',
            {
                method: 'POST',
                body: deviceInfo
            }).then(response => response.json() as DeviceModel);
    }

    public removeDevice(id: string): Promise<any> {
        return this.sendAuthorizedRequest(`/api/devices/${id}`, { method: 'DELETE' });
    }

    public getDevices(): Promise<DeviceModel[]> {
        return this.sendAuthorizedRequest('/api/devices',
            { method: 'GET' })
            .then(response => response.json() as DeviceModel[]);
    }

    public sendUrl(id: string, url: string): Promise<any> {
        const body: CommandBody = {
            url: url
        };
        return this.sendAuthorizedRequest(`/api/devices/${id}/commands`,
            {
                method: 'POST',
                body: body
            });
    }

    private sendAuthorizedRequest(relativePath: string, options: RequestOptionsArgs): Promise<Response> {
        return ChromeAuthHelper.createAuthHeader()
            .then((authHeader: string) => {
                if (!options.headers) {
                    options.headers = new Headers();
                }
                options.headers.append('Cache-Control', 'no-cache');
                options.headers.append('Authorization', authHeader);

                if(options.body) {
                    options.headers.append('Content-type', 'application/json');
                    options.body = JSON.stringify(options.body);
                }
            })
            .then(() => this.http.request(this.baseUrl + relativePath, options).toPromise())
            .catch((response: Response) => {
                // Resolve on 302. This indicates that a POST request resulted in no change in storage (e.g. Found)
                if(response.status === 302) {
                    return response;
                }

                let error: ErrorModel;
                if (response && response.json().codeString) {
                    error = response.json();
                }

                // If the error is not defined, then construct a default error for the caller
                if(!error) {
                    let errorMsg: string = 'Response was contained an unknown error';

                    console.error(errorMsg);
                    error = {
                        code: ErrorCode.Unknown,
                        codeString: ErrorCode[ErrorCode.Unknown],
                        message: errorMsg
                    };
                }

                throw error;
            });
    }
};
