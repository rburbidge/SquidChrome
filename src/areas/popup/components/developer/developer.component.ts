import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UUID } from 'angular2-uuid';

import { DeviceType } from '../../../../contracts/squid';
import { SquidService } from '../../services/squid.service';
import { Route } from '../../routing/route';
import { SettingsService } from '../../services/settings.service';
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
        private readonly squidService: SquidService,
        private readonly router: Router,
        private readonly settingsService: SettingsService,
        private readonly windowService: WindowService) { }

    /**
     * Add a fake device with an invalid GCM token.
     */
    public addDevice(): Promise<any> {
        let gcmToken = UUID.UUID();
        let name = 'Device ' + gcmToken.substring(0, 8); // Use only the first 8 chars of the token, for readability
        return this.squidService.addDevice({name: name, gcmToken: gcmToken, deviceType: DeviceType.chrome})
            .then(() => this.router.navigateByUrl(Route.home.devices));
    }

    /**
     * Reset the app to default settings.
     */
    public resetApp(): Promise<void> {
        return this.settingsService.reset()
            .then(() => this.windowService.close());
    }
}