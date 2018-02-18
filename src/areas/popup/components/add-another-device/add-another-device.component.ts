import { Component } from '@angular/core';
import { Location } from '@angular/common';

import { Config } from '../../../../config/config';
import { Strings } from '../../../../assets/strings/strings';
import { ChromeService } from '../../services/chrome.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

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
        private readonly route: ActivatedRoute,
        private readonly location: Location,
        private readonly chrome: ChromeService,
        private readonly router: Router) {}

    public openPlayStore(): void {
        this.chrome.openTab(this.config.googlePlayStore);
    }

    public openChromeWebStore(): void {
        this.chrome.openTab(this.config.chromeWebStore);
    }

    /**
     * Navigates to the return URL if provided, or to the last URL.
     */
    public back(): void {
        const returnUrl = this.route.snapshot.queryParams.returnUrl;
        if(returnUrl !== undefined) {
            this.router.navigateByUrl(returnUrl);
        } else {
            this.location.back();
        }
    }
}