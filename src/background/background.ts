/**
 * Handle incoming GCM messages.
 * - Messages will be handled even if the user hasn't used the app within this instance of Google Chrome.
 * - Messages will NOT be handled if Chrome is not running.
 * TODO Write tests for this
 */
chrome.gcm.onMessage.addListener((message) => {
    if(!message) return;

    // TODO Use a contract for data payload
    const data = message.data as any;
    if(data.type == 'Url') {
        chrome.tabs.create({ url: data.data });
    }
});