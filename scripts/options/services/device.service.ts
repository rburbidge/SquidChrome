import { Injectable } from '@angular/core';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/timeout';
import 'rxjs/add/operator/toPromise';

import { ChromeAuthHelper } from '../../common/chrome-auth-helper';
import { Config } from '../../config';
import { DeviceModel, ErrorCode, ErrorModel } from '../../contracts/squid';

/**
 * The device service.
 */
@Injectable()
export class DeviceService {
    private baseUrl: string = Config.squidEndpoint;
    private static timeoutMillis: number = 3000;

    constructor(private http: Http) { }

    public addDevice(name: string, gcmToken: string): Promise<DeviceModel> {
        let headers = new Headers();
        headers.append('Content-type', 'application/json');
        return this.sendAuthorizedRequest('/api/devices', new RequestOptions(
            {
                method: 'POST',
                body: JSON.stringify({ name: name, gcmToken: gcmToken }),
                headers: headers
            })).then(response => response.json() as DeviceModel);
    }

    public removeDevice(id: string): Promise<any> {
        return this.sendAuthorizedRequest(`/api/devices/${id}`, new RequestOptions({ method: 'DELETE' }));
    }

    public getDevices(): Promise<DeviceModel[]> {
        return this.sendAuthorizedRequest('/api/devices', new RequestOptions({ method: 'GET' }))
            .then(response => response.json() as DeviceModel[]);
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
                        // TODO The API changed. Put a timeout in here somehow
                        //.timeout(DeviceService.timeoutMillis, { code: SquidErrorCode.Timeout })
                        .toPromise()
                        .then(resolve)
                        .catch((response: Response) => {
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

                            reject(error);
                        });
                });
            });   
    }
};
