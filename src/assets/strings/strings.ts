/**
 * The app strings.
 */
export class Strings {
    public loading = 'Loading...';
    public name = 'Name';
    public retry = 'Retry';

    /**
     * Strings for the add device flow.
     */
    public addDevice = {
        addDevice: 'Add device',
        addingDevice: 'Registering your device...',
        defaultDeviceName: 'Chrome Browser',
    };

    /**
     * Strings for the devices flow.
     */
    public devices = {
        deleteComplete: (deviceName: string) => `${deviceName} has been deleted`,
        deleteConfirm: (deviceName: string) => `To use this ${deviceName} again, you will need to register it through the Squid app on your Android device.
        
Are you sure you want to delete ${deviceName}?`,
        deleteError: 'An error occurred while removing the device. Please try again later.',

        noDevicesTitle: 'No devices found',
        noDevicesMessage: 'Install Squid on your Android phone, and then retry!',

        refreshError: 'Oops! An error occurred while retrieving your settings. Try again later.',

        selectDevice: 'Select a device'
    };

    /**
     * Strings for the send page pop-up action.
     */
    public sendPage = {
        error: 'An error occurred',
        noSelectedDevice: 'You have no selected device.',
        noSelectedDeviceOpeningOptionsPage: 'You have no selected device. Opening options page',  
        pageCannotBeSent: 'Click this while on a different tab. The options page cannot be sent.',
        pageCannotBeSentOptions: 'Click this while on a different tab. This page cannot be sent.',
        sendingTo: (deviceName: string) => `Sending to ${deviceName}...`,
        sentTo: (deviceName: string) => `Sent to ${deviceName}!`,
    };

    /**
     * Strings for the signed out component.
     */
    public signedOut = {
        signedOutMessage: 'Squid requires you to be signed into Google Chrome',
        signIn: 'Sign in',
    };
}