import $ from 'jquery';

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

    chrome.storage.sync.get(
        { device: null },
        (items: any) => {
            // TODO Don't hardcode URL
            let deviceId: string = items.device.id;
            new Devices('http://71.231.137.10').sendUrl(deviceId, url)
                .then(() => {
                    renderStatus('Sent');
                })
                .catch((error) => {
                    renderError(error);
                });
        });
});