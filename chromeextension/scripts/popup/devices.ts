import $ from 'jquery';

import { ChromeAuthHelper } from '../common/chrome-auth-helper';

/**
 * Devices adapter for sending requests from the popup. This is not an angular HTTP client because the popup is not an
 * angular application.
 */
export class Devices {

    /**
     * @baseUrl - The base squid service URL.
     */
    constructor(private baseUrl: string) { }

    /**
     * Sends a URL to a device.
     */
    public sendUrl(deviceId: string, url: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            ChromeAuthHelper.createAuthHeader()
                .then((authHeader) => {
                    let options: any = {
                        type: 'POST',
                        url: this.baseUrl + `/api/devices/${deviceId}/commands`,
                        data: JSON.stringify({ url: url }),
                        headers: {
                            Authorization: authHeader,
                            'Content-Type': 'application/json'
                        }
                    };

                    $.ajax(options)
                        .done(resolve)
                        .fail(reject);
                })
                .catch(reject);
        });
    }
}