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
    document.getElementById('status').textContent = statusText;
}

function renderError(statusText) {
    renderStatus('Error: ' + statusText);
}

document.addEventListener('DOMContentLoaded', function() {
    getCurrentTabUrl(function(url) {
        renderStatus('Sending... ' + url);

        chrome.storage.sync.get(
            { device: null },
            function(items) {
                devices.sendUrlToDevice(
                    items.device.id,
                    url,
                    function() {
                        renderStatus('Sent');
                    },
                    renderError);
            });
    });
});