export class Strings {
    public addDevice = 'Add device';
    public name = 'Name';
    public registeringDevice = 'Registering your device...';
    public defaultDeviceName = 'Chrome Browser';

    public signedOutMessage = 'Squid requires you to be signed into Google Chrome';
    public signIn = 'Sign in';

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
    }
}