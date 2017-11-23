import { Component } from '@angular/core';
import { UUID } from 'angular2-uuid';

import { DeviceService } from '../../services/device.service';
import { SettingsService } from '../../services/settings.service';
import { optionsPageUrl, UrlHelper } from '../../../common/url-helper';

/**
 * Shows developer options.
 */
@Component({
    selector: 'developer',
    templateUrl: './developer.html'
})
export class DeveloperComponent {
    constructor(
        private readonly deviceService: DeviceService,
        private readonly settingsService: SettingsService) { }

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
                window.location.href = optionsPageUrl;
            });
    }
}