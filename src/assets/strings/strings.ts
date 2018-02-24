/**
 * The app strings.
 */
export class Strings {
    public title = 'Squid';
    public later = 'Later';
    public loading = 'Loading...';
    public name = 'Name';
    public next = 'Next';
    public retry = 'Retry';
    
    /**
     * Strings for the add device flow.
     */
    public addDevice = {
        line1: "What's the name of this device?",
        addDevice: 'Add device',
        addingDevice: 'Registering your device...',
        defaultDeviceName: 'Chrome Browser',
    };

    public addAnotherDevice = {
        line1: 'Add another device!',
        line2: 'To add another device, simply install and run Squid on that device!'
    };

    /**
     * Strings for the devices flow.
     */
    public devices = {
        addDevice: 'Add a device',
        deleteComplete: (deviceName: string) => `${deviceName} has been deleted`,
        deleteConfirm: (deviceName: string) => `To use this ${deviceName} again, you will need to register it through the Squid app on your Android device.
Are you sure you want to delete ${deviceName}?`,
        deleteError: 'An error occurred while removing the device. Please try again later.',
        noDevicesTitle: 'No devices found',
        noDevicesMessage: 'Install Squid on your Android phone, and then retry!',
        refreshError: 'Oops! An error occurred while retrieving your settings. Try again later.',
        selectDevice: 'Select a device'
    };

    public intro = {
        descriptionLine1: 'Welcome to Squid!',
        descriptionLine2: 'Squid lets you send web pages between your devices!',
        signInLine1: 'Sign in to your Google account!',
        signInLine2: 'Squid provides a secure experience using Google authentication.',
        signIn: 'Sign in',
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

    public options = {
        title: 'Settings'
    };
}