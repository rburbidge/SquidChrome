import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Config } from '../../../config';
import { DeviceService } from '../../services/device.service';
import { GcmService } from '../../services/gcm.service';
import { Route } from '../../route';
import { SettingsService } from '../../services/settings.service';
import { UrlHelper } from '../../../common/url-helper';

/**
 * Page that allows the user to register their device.
 */
@Component({
    selector: 'add-device',
    templateUrl: './add-device.html'
})
export class AddDeviceComponent {
    private static defaultDeviceName: string = 'Chrome Browser';

    private isLoading: boolean = false;

    constructor(
        private readonly gcmService: GcmService,
        private readonly deviceService: DeviceService,
        private readonly router: Router,
        private readonly settingsService: SettingsService) { }

    public addDevice(name: string): Promise<void> {
        this.isLoading = true;

        // Use default device name if none was chosen
        if(!name) {
            name = AddDeviceComponent.defaultDeviceName;
        }

        return this.gcmService.register([Config.gcmSenderId])
            .then(gcmToken => {
                // TODO Save device model in settings
                this.settingsService.setInitialized()
                    .then(() => this.deviceService.addDevice(name, gcmToken))
                    .then(() => this.router.navigateByUrl(Route.options))
            })
            .catch(error => {
                // TODO Show some error message
            })
    }
}