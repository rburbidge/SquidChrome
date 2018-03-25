import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ChromeService } from '../../services/chrome.service';
import { ChromeDeviceModel } from '../../services/squid-converter';
import { Config } from '../../../../config/config';
import { DeviceModel, DeviceType, ErrorCode, ErrorModel } from '../../../../contracts/squid';
import { DeviceService } from '../../services/device.service';
import { Route } from '../../routing/route';
import { Strings } from '../../../../assets/strings/strings';
import { UrlHelper } from '../../../common/url-helper';
import { WindowService } from '../../services/window.service';
import { SettingsService } from '../../services/settings.service';

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
    public isLoading: boolean = true;
    public error: string;

    constructor(
        private readonly windowService: WindowService,
        private readonly deviceService: DeviceService,
        private readonly router: Router,
        private readonly chromeService: ChromeService,
        private readonly settingsService: SettingsService)
    { }

    /**
     * Sends a URL to a device.
     * @param device The device to send the URL to.
     */
    public sendUrl(device: ChromeDeviceModel): Promise<void> {
        return this.chromeService.getCurrentTabUrl()
            .then(url => this.deviceService.sendUrl(device.id, url))
            .then(() => this.windowService.close());
    }

    public onError(error: ErrorModel): void {
        if(error.code == ErrorCode.NotSignedIn || error.code == ErrorCode.UserNotFound) {
            this.goToIntroComponent();
        }
    }

    public onLoad(otherDevices: ChromeDeviceModel[]): void {
        // Continue showing loading indicator if there are no other devices
        this.isLoading = !otherDevices || otherDevices.length == 0;
    }

    private goToIntroComponent() {
        this.router.navigateByUrl(Route.intro.base);
    }

    private goToAddAnotherDevice(): void {
        this.router.navigateByUrl(Route.addAnotherDevice);
    }

    /**
     * Redirect to appropriate page if the app is not initialized. This is done here asynchronously because it requires
     * calling Squid service, and we want to show the UI before that happens.
     */
    public ngOnInit(): Promise<void> {
        const thisDevice = this.settingsService.settings.thisDevice;
        if(!thisDevice) {
            this.goToIntroComponent();
            return Promise.resolve();
        }

        return this.deviceService.getDevices()
            .then(devices => {
                // If the current device is not registered, go to intro component
                if(!devices || !devices.find(device => device.id == thisDevice.id)) {
                    this.goToIntroComponent();
                // Otherwise if no other device is registered (one without current ID), got to add another device component
                } else if(devices.every(device => device.id == thisDevice.id)) {
                    this.goToAddAnotherDevice();
                }
            });
    }
}