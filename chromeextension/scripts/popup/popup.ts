import $ from 'jquery';

import { ChromeStorageService } from '../options/services/chrome-storage.service';
import { Config } from '../config';
import { Devices } from './devices';
import { Device } from '../models/device';
import { UrlHelper } from '../common/url-helper';
import { UrlType } from '../common/url-type';

class Popup {
    /**
     * Get the current URL.
     * @param {function(string)} callback - called when the URL of the current tab
     *     is found.
     */
    public static getCurrentTabUrl(): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            var queryInfo = {
                active: true,
                currentWindow: true
            };

            chrome.tabs.query(queryInfo, function(tabs) {
                // Can safely assume that at least one tab is open
                resolve(tabs[0].url);
            });
        });
    }

    public static renderStatus(statusText): void {
        $('#status').html(statusText);
    }

    /**
     * Called when the user has no selected device. Renders the pop-up, and opens the options page if it is not already
     * the current tab.
     */
    public static noSelectedDevice(isOptionsPage: boolean): void {
        // Render the 'no device' message
        let message = 'You have no selected device.';
        if (!isOptionsPage) {
            message += ' Opening options page...';
        }
        Popup.renderStatus(message);

        // The pop-up will close when the options page is opened, so do so after a delay to give the user a chance
        // to read it
        if (!isOptionsPage) {
            const timeToShowMs = 2000;
            window.setTimeout(() => UrlHelper.openOptionsPage(), timeToShowMs);
        }
    }
}

// The main method
Promise.all(
    [
        Popup.getCurrentTabUrl(),
        new ChromeStorageService().getSelectedDevice()
    ])
    .then((values) => {
        let url: string = values[0];
        let device: Device = values[1];

        console.log('Sending URL: ' + url);

        // Determine if the URL can be sent to the device
        let urlType: UrlType = UrlHelper.getUrlType(url);
        let isOptionsPage = urlType === UrlType.Options;

        // Does the user have a selected device? If not, send to the options page so they can select one
        if (!device) {
            Popup.noSelectedDevice(isOptionsPage);
            return;
        }

        // Prevent user from sending chrome extension pages, such as the options page
        // *This is intentionally after the device check because we are more concerned that the user has no selected
        // device
        if (urlType == UrlType.Options) {
            Popup.renderStatus('Click this while on a different tab. The options page cannot be sent.');
            return;
        }

        if(!UrlHelper.canSendUrlType(urlType)) {
            Popup.renderStatus('Click this while on a different tab. This page cannot be sent.');
            return;
        }

        // Send the URL
        Popup.renderStatus(`Sending to ${device.name}...`);

        new Devices(Config.squidEndpoint).sendUrl(device.id, url)
            .then(() => {
                Popup.renderStatus(`Sent to ${device.name}!`);
                const timeToShowMs = 3000;
                window.setTimeout(window.close, timeToShowMs);
            })
            .catch((error) => {
                if(error.status === 404) {
                    Popup.noSelectedDevice(isOptionsPage);
                    return;
                }

                Popup.renderStatus('An error occurred');

                // TODO Log telemetry when there is an error
            });
    });