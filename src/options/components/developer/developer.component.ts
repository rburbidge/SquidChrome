import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UUID } from 'angular2-uuid';

import { ChromeService } from '../../services/chrome.service';
import { DeviceService } from '../../services/device.service';
import { SettingsService } from '../../services/settings.service';
import { UrlHelper } from '../../../common/url-helper';
import { WindowService } from '../../services/window.service';

/**
 * Shows developer options.
 */
@Component({
    selector: 'developer',
    templateUrl: './developer.html'
})
export class DeveloperComponent {
    constructor(
        private readonly chromeService: ChromeService,
        private readonly deviceService: DeviceService,
        private readonly router: Router,
        private readonly settingsService: SettingsService,
        private readonly windowService: WindowService) { }

    /**
     * Add a fake device with an invalid GCM token.
     */
    public addDevice(): Promise<any> {
        let gcmToken = UUID.UUID();
        let name = 'Device ' + gcmToken.substring(0, 8); // Use only the first 8 chars of the token, for readability
        return this.deviceService.addDevice(name, gcmToken)
    }

    /**
     * Reset the app to default settings.
     */
    public resetApp(): Promise<void> {
        return this.settingsService.reset()
            .then(() => {
                // Developer component is currently being by the options page. On reset of application, just refresh
                // the options page
                this.windowService.setUrl(this.chromeService.getOptionsUrl());
            });
    }
}