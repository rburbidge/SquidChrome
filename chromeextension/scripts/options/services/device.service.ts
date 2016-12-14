import { Injectable } from '@angular/core';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/timeout';
import 'rxjs/add/operator/toPromise';

import { ChromeAuthHelper } from '../../common/chrome-auth-helper';
import { Config } from '../../config';
import { Device } from '../../models/device';
import { SquidError, createSquidError } from '../../models/squid-error';
import { SquidErrorCode } from '../../models/squid-error-code';

/**
 * The device service.
 */
@Injectable()
export class DeviceService {
    private baseUrl: string = Config.squidEndpoint;
    private static timeoutMillis: number = 3000;

    constructor(private http: Http) { }

    public getDevices(): Promise<Device[]> {
        return this.sendAuthorizedRequest('/api/devices', new RequestOptions({ method: 'GET'}))
            .then(response => response.json() as Device[]);
    }

    public sendUrlToDevice(deviceId: string): Promise<Response> {
        return this.sendAuthorizedRequest(`/api/devices/${deviceId}/commands`, new RequestOptions({ method: 'POST' }));
    }

    private sendAuthorizedRequest(relativePath: string, options: RequestOptions): Promise<Response> {
        return new Promise<Response>((resolve, reject) => {
            return ChromeAuthHelper.createAuthHeader()
                .then((authHeader: string) => {
                    if (!options.headers) {
                        options.headers = new Headers();
                    }

                    options.headers.append('Authorization', authHeader);

                    this.http.request(this.baseUrl + relativePath, options)
                        .timeout(DeviceService.timeoutMillis, { code: SquidErrorCode.Timeout })
                        .toPromise()
                        .then(resolve)
                        .catch((response: any) => {
                            let error: SquidError;
                            if (response) {
                                if (response.json) {
                                    // Response JSON was returned, which might be a SquidError
                                    error = createSquidError(response.json());
                                } else {
                                    // SquidError object might have been returned from a timeout
                                    error = response as SquidError;
                                }
                            }

                            // If the error is falsy, then construct a default error for the caller
                            if(!error) {
                                let errorMsg: string = 'Response was falsy';

                                console.error(errorMsg);
                                error = {
                                    code: SquidErrorCode.Unknown,
                                    message: errorMsg
                                };
                            }

                            // Fill in the error code with a default if it is missing
                            if(error.code === undefined || error.code === null) {
                                console.error('Error code was undefined');
                                error.code = SquidErrorCode.Unknown;
                            }
                            reject(error);
                        });
                });
            });   
    }
};
