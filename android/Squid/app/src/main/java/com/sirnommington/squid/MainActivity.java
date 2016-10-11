package com.sirnommington.squid;

import android.app.Activity;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.AsyncTask;
import android.os.Build;
import android.os.Bundle;
import android.support.v4.content.LocalBroadcastManager;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.widget.Toast;

import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.common.GoogleApiAvailability;
import com.sirnommington.squid.activity.Actions;
import com.sirnommington.squid.services.AddDeviceResult;
import com.sirnommington.squid.services.SquidService;

public class MainActivity extends AppCompatActivity {

    private static final int PLAY_SERVICES_RESOLUTION_REQUEST = 9000;
    private static final String TAG = "MainActivity";

    private BroadcastReceiver mRegistrationBroadcastReceiver;
    private boolean isReceiverRegistered;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        final String idToken = this.getIntent().getStringExtra(IntentExtras.GOOGLE_ID_TOKEN);

        final Activity thiz = this;

        // When retrieving GCM token completes, register the device with the Squid service
        mRegistrationBroadcastReceiver = new BroadcastReceiver() {
            @Override
            public void onReceive(Context context, Intent intent) {
                // GCM token is available from BroadcastReceiver intent, NOT MainActivity intent
                final String gcmToken = intent.getStringExtra(IntentExtras.GCM_TOKEN);

                new AsyncTask<String, Void, String>() {
                    @Override
                    protected String doInBackground(String... params) {
                        try {
                            final SquidService squid = new SquidService(getResources().getString(R.string.squid_endpoint));
                            final String deviceName = Build.MODEL;

                            // Determine the result message
                            AddDeviceResult result = squid.addDevice(idToken, deviceName, gcmToken);
                            switch(result) {
                                case AlreadyExists:
                                    return getResources().getString(R.string.add_device_already_added);
                                case Added:
                                    return getResources().getString(R.string.add_device_added, deviceName);
                                default:
                                    return getResources().getString(R.string.add_device_error);
                            }
                        } catch(Exception e) {
                            Log.e(TAG, "Exception thrown while adding device: " + e.toString());
                            return getResources().getString(R.string.add_device_error);
                        }
                    }

                    @Override
                    protected void onPostExecute(String message) {
                        super.onPostExecute(message);
                        Toast.makeText(thiz, message, Toast.LENGTH_LONG).show();
                    }
                }.execute();
            }
        };

        // Registering BroadcastReceiver
        registerReceiver();

        if (checkPlayServices()) {
            // Start IntentService to register this application with GCM
            Intent intent = new Intent(this, SquidRegistrationIntentService.class);
            startService(intent);
        }
    }

    @Override
    protected void onResume() {
        super.onResume();
        registerReceiver();
    }

    @Override
    protected void onPause() {
        LocalBroadcastManager.getInstance(this).unregisterReceiver(mRegistrationBroadcastReceiver);
        isReceiverRegistered = false;
        super.onPause();
    }

    private void registerReceiver(){
        if(!isReceiverRegistered) {
            LocalBroadcastManager.getInstance(this).registerReceiver(mRegistrationBroadcastReceiver,
                    new IntentFilter(Actions.GCM_REGISTRATION_COMPLETE));
            isReceiverRegistered = true;
        }
    }
    /**
     * Check the device to make sure it has the Google Play Services APK. If
     * it doesn't, display a dialog that allows users to download the APK from
     * the Google Play Store or enable it in the device's system settings.
     */
    private boolean checkPlayServices() {
        GoogleApiAvailability apiAvailability = GoogleApiAvailability.getInstance();
        int resultCode = apiAvailability.isGooglePlayServicesAvailable(this);
        if (resultCode != ConnectionResult.SUCCESS) {
            if (apiAvailability.isUserResolvableError(resultCode)) {
                apiAvailability.getErrorDialog(this, resultCode, PLAY_SERVICES_RESOLUTION_REQUEST)
                        .show();
            } else {
                // TODO Show error to user
                Log.i(TAG, "This device is not supported.");
                finish();
            }
            return false;
        }
        return true;
    }
}
