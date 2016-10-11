package com.sirnommington.squid.services;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.DataOutputStream;
import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URL;

/**
 * Squid web service adapter.
 */
public class SquidService {

    private static final String TAG = "SquidService";

    private final String endpoint;

    /**
     * @param endpoint The endpoint. e.g. https://www.host.com
     */
    public SquidService(String endpoint) {
        this.endpoint = endpoint;
    }

    /**
     * Adds a new device for a user.
     * @param idToken The Google OAuth ID token to send.
     * @param name The device name.
     * @param gcmToken The device GCM token.
     * @return Result indicating added, already existed, etc.
     * @throws IOException If there is an issue sending the request.
     * @throws JSONException If there is an issue constructing the outgoing request.
     */
    public AddDeviceResult addDevice(String idToken, String name, String gcmToken) throws IOException, JSONException {
        final JSONObject body = new JSONObject();
        body.put("name", name);
        body.put("gcmToken", gcmToken);

        final int statusCode = this.sendRequest(idToken, "POST", "/api/devices", body);
        switch(statusCode) {
            case 304:
                return AddDeviceResult.AlreadyExists;
            case 200:
                return AddDeviceResult.Added;
            default:
                return AddDeviceResult.Error;
        }
    }

    /**
     * Helper method for sending HTTP requests.
     * @param idToken The Google OAuth ID token to send.
     * @param requestMethod GET, PUT, etc.
     * @param relativePath The relative path. Must be preceded with a forward slash.
     * @param body The JSON body, if any.
     * @throws IOException If there is an issue sending the request.
     * @return The HTTP status code.
     */
    private int sendRequest(String idToken, String requestMethod, String relativePath, JSONObject body) throws IOException {
        URL url = new URL(this.endpoint + relativePath);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod(requestMethod);

        // Header prefixes are one of the following:
        // 'Bearer Google OAuth Access Token='
        // 'Bearer Google OAuth ID Token='
        // See http://stackoverflow.com/questions/8311836/how-to-identify-a-google-oauth2-user/13016081#13016081 for
        // details on Google access vs. ID tokens
        conn.setRequestProperty("Authorization", "Bearer Google OAuth ID Token=" + idToken);

        if(body != null) {
            conn.setRequestProperty("Content-Type", "application/json");
        }

        conn.connect();

        if(body != null) {
            DataOutputStream output = new DataOutputStream(conn.getOutputStream());
            output.writeBytes(body.toString());
            output.flush ();
            output.close ();
        }

        return conn.getResponseCode();
    }
}
