import $ from 'jquery';

import { ChromeStorageService } from '../options/services/chrome-storage.service';
import { Config } from '../config';
import { Devices } from './devices';

/**
 * Get the current URL.
 *
 * @param {function(string)} callback - called when the URL of the current tab
 *     is found.
 */
function getCurrentTabUrl(callback) {
    var queryInfo = {
        active: true,
        currentWindow: true
    };

    chrome.tabs.query(queryInfo, function(tabs) {
        // Can safely assume that at least one tab is open
        callback(tabs[0].url);
    });
}
function renderStatus(statusText) {
    $('#status').html(statusText);
}

function renderError(statusText) {
    renderStatus('Error: ' + statusText);
}

getCurrentTabUrl((url) => {
    renderStatus('Sending... ' + url);

    new ChromeStorageService().getSelectedDevice()
        .then((device) => {
            new Devices(Config.squidEndpoint).sendUrl(device.id, url)
                .then(() => {
                    renderStatus('Sent');
                })
                .catch((error) => {
                    renderError(error);
                });
        })
});