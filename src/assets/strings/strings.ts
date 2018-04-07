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
    
    public about = {
        title: 'About',
        thankYou: 'Thank you for using Squid!',
        appIcon: 'The app icon was provided by',
        otherIcons: 'Other icons were provided by',
        underThe: ' under the ',
        apache20Link: {
            url: 'http://www.apache.org/licenses/LICENSE-2.0.txt',
            text: 'Apache License Version 2.0'
        },
        creativeCommonsLink: {
            url: 'https://creativecommons.org/licenses/by/3.0/us/',
            text: 'Creative Commons 3.0 BY license'
        },
        gameIconsLink: {
            url: 'http://game-icons.net'
        },
        googleMaterialIconsLink: {
            url: 'https://google.github.io/material-design-icons/',
            text: 'Google Material Design'
        }
    }

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

    public developer = {
        title: 'Developer settings'
    };

    /**
     * Strings for the devices flow.
     */
    public devices = {
        addDevice: 'Add a device',
        noDevicesTitle: 'No devices found',
        noDevicesMessage: 'Install Squid on your Android phone, and then retry!',
        pageCannotBeSent: 'This page cannot be sent. Please try a different tab.',
        refreshError: 'Oops! An error occurred while retrieving your settings. Try again later.',
        selectDevice: 'Select a device',
        thisDevice: 'This device',
    };

    public device = {
        removeConfirm: (deviceName: string) => `To use ${deviceName} again, you will need to re-run Squid on that device.\n\nAre you sure you want to remove ${deviceName}?`,
        removeDevice: 'Remove this device',
        trySendingLink: 'Try sending a link'
    }

    public intro = {
        descriptionLine1: 'Welcome to Squid!',
        descriptionLine2: 'Squid lets you send web pages between your devices!',
        signInLine1: 'Sign in to your Google account!',
        signInLine2: 'Squid provides a secure experience using Google authentication.',
        signIn: 'Sign in',
    };

    public manageDevices = {
        title: "Manage devices"
    };

    public options = {
        title: 'Settings',
        manageDevices: 'Manage Devices'
    };
}