package com.sirnommington.squid;

import android.app.NotificationManager;
import android.content.Context;
import android.content.Intent;
import android.media.Ringtone;
import android.media.RingtoneManager;
import android.net.Uri;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
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
            } else if(GcmMessageType.PHONE.equals(type)) {
                Intent i = new Intent(Intent.ACTION_DIAL);
                i.setData(Uri.parse("tel:" + data.getString("data")));
                i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                startActivity(i);
            } else {
                error("Unable to handle data=" + data);
            }

            playSound();
        } catch(Exception e) {
            error("onMessageReceived() failure. data=" + data, e);
        }
    }

    private void error(String message) {
        error(message, null);
    }

    private void error(final String message, Exception e) {
        Log.e(TAG, message, e);

        // Show toast on UI thread
        final Context thisContext = this;
        new Handler(Looper.getMainLooper()).post(
            new Runnable() {
                public void run() {
                    Toast.makeText(thisContext, message, Toast.LENGTH_LONG).show();
                }
            }
        );
    }

    private void playSound() {
        Uri notification = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION);
        Ringtone r = RingtoneManager.getRingtone(this, notification);
        r.play();
    }
}
