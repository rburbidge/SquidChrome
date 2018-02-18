import { Component } from '@angular/core';
import { Location } from '@angular/common';

import { Config } from '../../../../config/config';
import { Strings } from '../../../../assets/strings/strings';
import { ChromeService } from '../../services/chrome.service';

/**
 * Shows links to the stores where the app is available.
 */
@Component({
    selector: 'add-another-device',
    templateUrl: './add-another-device.html',
    styleUrls: [ './add-another-device.css' ]
})
export class AddAnotherDeviceComponent {
    public readonly strings: Strings = new Strings();
    public readonly config: Config = new Config();

    constructor(
        private readonly location: Location,
        private readonly chrome: ChromeService) {}

    public openPlayStore(): void {
        this.chrome.openTab(this.config.googlePlayStore);
    }

    public openChromeWebStore(): void {
        this.chrome.openTab(this.config.chromeWebStore);
    }

    public back(): void {
        this.location.back();
    }
}