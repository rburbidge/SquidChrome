import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ChromeService } from '../../services/chrome.service';
import { ChromeAuthHelper } from '../../../common/chrome-auth-helper';
import { ChromeDeviceModel } from '../../services/squid-converter';
import { Config } from '../../../../config/config';
import { DeviceModel, DeviceType, ErrorCode, ErrorModel } from '../../../../contracts/squid';
import { DeviceService } from '../../services/device.service';
import { Route } from '../../routing/route';
import { SettingsService } from '../../services/settings.service';
import { Strings } from '../../../../assets/strings/strings';
import { UrlHelper } from '../../../common/url-helper';
import { WindowService } from '../../services/window.service';

/**
 * Shows the user's devices. Selecting a device sends the current tab's URL to that device.
 */
@Component({
    selector: 'select-device',
    templateUrl: './select-device.html',
    styleUrls: ['./select-device.css']
})
export class SelectDeviceComponent implements OnInit {

    public readonly strings: Strings = new Strings();

    constructor(
        private readonly windowService: WindowService,
        private readonly deviceService: DeviceService,
        private readonly router: Router,
        private readonly chromeService: ChromeService,
        private readonly settingsService: SettingsService)
    { }

    public isLoading: boolean = true;
    public error: string;
    public devices: ChromeDeviceModel[] = [];
    public message: string;

    /**
     * Sends a URL to a device.
     * @param device The device to send the URL to.
     */
    public sendUrl(device: ChromeDeviceModel): Promise<void> {
        return this.chromeService.getCurrentTabUrl()
            .then(url => this.deviceService.sendUrl(device.id, url))
            .then(() => this.windowService.close());
    }

    /**
     * Sync both the selected device, and the other devices from the server.
     */
    public refreshDevices(): Promise<void> {
        this.isLoading = true;
        delete this.error;

        return this.deviceService.getDevices()
            .then(devices => {
                if(!devices || devices.length == 0) {
                    this.goToIntroComponent();
                    return;
                }

                this.devices = devices;
                this.isLoading = false;
            })
            .catch((error: ErrorModel) => this.handleError(error));
    }

    private handleError(error: ErrorModel): Promise<void> {
        const getSettings = this.settingsService.getSettings();
        const getIsSignedIn = this.chromeService.isSignedIntoChrome();

        return Promise.all([getSettings, getIsSignedIn])
            .then(results => {
                const isInitialized = results[0].initialized;
                const isSignedIn = results[1];

                // Redirect to the intro if not initialized, or user not found on the server, or not signed into Chrome
                if(!isInitialized
                    || (error && error.code == ErrorCode.UserNotFound)
                    || !isSignedIn)
                {
                    this.goToIntroComponent();
                    return;
                }

                this.onError(this.strings.devices.refreshError);
                this.isLoading = false;
                return;
            });
    }

    /**
     * Navigates to the intro component.
     */
    private goToIntroComponent() {
        this.router.navigateByUrl(Route.intro.base);
    }

    private onError(error: string): void {
        this.isLoading = false;
        this.error = error;
    }

    public ngOnInit(): Promise<void> {
        return this.refreshDevices();
    }
}