var devices = {};

devices.baseUrl = config.squidEndpoint;

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

devices.sendUrlToDevice = function(deviceId, url, callback, errorCallback) {
    this.sendAuthorizedRequest(
        {
            type: 'POST',
            url: this.baseUrl + `/api/devices/${deviceId}/commands`,
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

        // Header prefixes are one of the following:
        // 'Bearer Google OAuth Access Token='
        // 'Bearer Google OAuth ID Token='
        // See http://stackoverflow.com/questions/8311836/how-to-identify-a-google-oauth2-user/13016081#13016081 for details on what access
        settings.headers.Authorization = `Bearer Google OAuth Access Token=${token}`;

        // Add content type if we are sending data
        if(settings.data) {
            settings.headers['Content-Type'] = 'application/json';
        }

        $.ajax(settings)
            .done(callback)
            .fail(errorCallback);
    });
};