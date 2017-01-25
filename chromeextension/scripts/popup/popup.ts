import $ from 'jquery';

import { ChromeStorageService } from '../options/services/chrome-storage.service';
import { Config } from '../config';
import { Devices } from './devices';

class Popup {
    public static optionsPageName = "options.html";

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

    public static renderError(statusText): void {
        Popup.renderStatus('Error: ' + statusText);
    }

    public static openOptionsPage(): void {
        // openOptionsPage() was introduced in Chrome 42. This will not open a duplicate options tab, but will focus on
        // any existing one
        if (chrome.runtime.openOptionsPage) {
            chrome.runtime.openOptionsPage();
            return;
        }

        // Fallback to opening options page by name. This will open a duplicate options tab if one is already open
        window.open(chrome.runtime.getURL(Popup.optionsPageName));
    }

    public static isOptionsPage(url: string): boolean {
        return url.startsWith('chrome-extension') && url.endsWith(Popup.optionsPageName);
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
        let device: any = values[1];

        let isOptionsPage: boolean = Popup.isOptionsPage(url);

        if (!device) {
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
                window.setTimeout(() => Popup.openOptionsPage(), timeToShowMs);
            }

            return;
        }

        // Prevent user from sending chrome extension pages, such as the options page
        if (isOptionsPage) {
            Popup.renderStatus('Click this while on a different tab. The options page cannot be sent.');
            return;
        }

        new Devices(Config.squidEndpoint).sendUrl(device.id, url)
            .then(() => {
                Popup.renderStatus('Sent');
            })
            .catch((error) => {
                // TODO Show user-friendly error message when there is an error
                // TODO Log telemetry when there is an error
                Popup.renderError(JSON.stringify(error));
            });
    });