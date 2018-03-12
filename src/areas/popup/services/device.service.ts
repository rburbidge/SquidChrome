import { Injectable } from '@angular/core';
import { Headers, Http, Response, RequestOptions, RequestOptionsArgs } from '@angular/http';
import 'rxjs/add/operator/timeout';
import 'rxjs/add/operator/toPromise';

import { Config } from '../../../config/config';
import { AddDeviceBody, CommandBody, DeviceModel, ErrorCode, ErrorModel } from '../../../contracts/squid';
import { ChromeDeviceModel, convertDeviceModel, ChromeErrorModel } from './squid-converter';
import { ChromeService } from './chrome.service';

/**
 * The device service.
 */
@Injectable()
export class DeviceService {
    private baseUrl: string = Config.squidEndpoint;
    private static timeoutMillis: number = 3000;

    constructor(private readonly http: Http, private readonly chrome: ChromeService) { }

    public addDevice(deviceInfo: AddDeviceBody): Promise<ChromeDeviceModel> {
        return this.sendRequest('/api/devices',
            {
                method: 'POST',
                body: deviceInfo
            }).then(response => convertDeviceModel(response.json() as DeviceModel));
    }

    public removeDevice(id: string): Promise<any> {
        return this.sendRequest(`/api/devices/${id}`, { method: 'DELETE' });
    }

    public getDevices(): Promise<ChromeDeviceModel[]> {
        return this.sendRequest('/api/devices',
            { method: 'GET' })
            .then(response => (response.json() as DeviceModel[]).map(device => convertDeviceModel(device)));
    }

    public sendUrl(id: string, url: string): Promise<any> {
        const body: CommandBody = {
            url: url
        };
        return this.sendRequest(`/api/devices/${id}/commands`,
            {
                method: 'POST',
                body: body
            });
    }

    /**
     * Helper method to send requests to Squid Service.
     * @param relativePath The relative path to hit.
     * @param options The request options.
     */
    private sendRequest(relativePath: string, options: RequestOptionsArgs): Promise<Response> {
        return this.authorize(options)
            .then(() => {
                options.headers.append('Cache-Control', 'no-cache');

                if(options.body) {
                    options.headers.append('Content-type', 'application/json');
                    options.body = JSON.stringify(options.body);
                }
            })
            .then(() => this.http.request(this.baseUrl + relativePath, options).toPromise())
            .catch((response: Response) => {
                if(response instanceof ChromeErrorModel) {
                    throw response;
                }

                // Resolve on 302. This indicates that a POST request resulted in no change in storage (e.g. Found)
                if(response.status === 302) {
                    return response;
                }

                let error: ErrorModel;
                try {
                    if(response.json().codeString) {
                        error = response.json();
                    }
                } catch(e) {
                    console.warn('Exception occurred when parsing error response JSON: ' + e);
                }

                // If the error is not defined, then construct a default error for the caller
                if(!error) {
                    error = {
                        code: ErrorCode.Unknown,
                        codeString: ErrorCode[ErrorCode.Unknown],
                        message: 'Response contained an unknown error: ' + response.text()
                    };
                }

                throw error;
            });
    }

    /**
     * Prepares a request for authorization with Squid Service.
     * @param reqOptions The request options. The Authorization header will be set with an access token.
     */
    private authorize(reqOptions: RequestOptionsArgs): Promise<void> {
        return this.chrome.getAuthToken(false)
            .then(authToken => {
                if (!reqOptions.headers) {
                    reqOptions.headers = new Headers();
                }

                // Header prefixes are one of the following:
                // 'Bearer Google OAuth Access Token='
                // 'Bearer Google OAuth ID Token='
                // See http://stackoverflow.com/questions/8311836/how-to-identify-a-google-oauth2-user/13016081#13016081
                // for details on access vs. ID tokens
                reqOptions.headers.append('Authorization', `Bearer Google OAuth Access Token=${authToken}`);
            });
    }
};
