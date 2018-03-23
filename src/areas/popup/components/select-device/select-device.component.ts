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

/**
 * Shows the user's devices. Selecting a device sends the current tab's URL to that device.
 */
@Component({
    selector: 'select-device',
    templateUrl: './select-device.html',
    styleUrls: ['./select-device.css']
})
export class SelectDeviceComponent {
    public readonly strings: Strings = new Strings();
    public isLoading: boolean = true;
    public error: string;

    constructor(
        private readonly windowService: WindowService,
        private readonly deviceService: DeviceService,
        private readonly router: Router,
        private readonly chromeService: ChromeService)
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
        this.isLoading = false;

        if(!otherDevices || otherDevices.length == 0) {
            this.goToAddAnotherDevice();
        }
    }

    /**
     * Navigates to the intro component.
     */
    private goToIntroComponent() {
        this.router.navigateByUrl(Route.intro.base);
    }

    private goToAddAnotherDevice(): void {
        this.router.navigateByUrl(Route.addAnotherDevice);
    }
}