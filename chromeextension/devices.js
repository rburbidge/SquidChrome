var devices = {};

//devices.baseUrl = 'http://sirnommington.com';
devices.baseUrl = 'http://localhost:3000';

devices.getDevices = function(callback, errorCallback) {
    this.sendAuthorizedRequest(
        {
            type: 'GET',
            url: this.baseUrl + '/api/devices',
        },
        callback,
        errorCallback);
};

devices.addDevice = function(callback, errorCallback) {
    this.sendAuthorizedRequest(
        {
            type: 'PUT',
            url: this.baseUrl + '/api/devices',
        },
        callback,
        errorCallback);
};

devices.sendUrlToDevice = function(url, callback, errorCallback) {
    this.sendAuthorizedRequest(
        {
            type: 'POST',
            url: this.baseUrl + '/api/devices/commands',
            data: JSON.stringify({ url: url }),
        },
        callback,
        errorCallback);
};

devices.sendAuthorizedRequest = function(settings, callback, errorCallback) {
    chrome.identity.getAuthToken({ 'interactive': true }, function(token) {
        if(chrome.runtime.lastError) {
            errorCallback(chrome.runtime.lastError);
            return;
        }

        // Add authorization header
        if(!settings.headers) {
            settings.headers = {};
        }
        settings.headers.Authorization = token;

        // Add content type if we are sending data
        if(settings.data) {
            settings.headers['Content-Type'] = 'application/json';
        }

        $.ajax(settings)
            .done(callback)
            .fail(errorCallback);
    });
};