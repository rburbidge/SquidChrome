package com.sirnommington.squid;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.util.Log;
import android.widget.Toast;

import com.google.android.gms.gcm.GcmListenerService;

public class SquidGcmListenerService extends GcmListenerService {

    private static final String TAG = "SquidGcmListenerService";

    @Override
    public void onMessageReceived(String from, Bundle data) {
        try {
            String type = data.getString("type");
            if (GcmMessageType.URL.equals(type)) {
                Intent i = new Intent(Intent.ACTION_VIEW);
                i.setData(Uri.parse(data.getString("data")));
                i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                startActivity(i);
            }
        } catch(Exception e) {
            Log.e(TAG, "onMessageReceived() failure. data=" + data, e);
            Toast.makeText(this, "onMessageReceived() failure. data=" + data + ", " + e, Toast.LENGTH_LONG).show();
        }
    }

    public void log(String message) {
        Toast.makeText(this, message, Toast.LENGTH_LONG).show();
    }
}
