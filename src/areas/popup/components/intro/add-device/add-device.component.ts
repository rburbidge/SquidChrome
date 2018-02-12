import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { DeviceType } from '../../../../../contracts/squid';
import { Config } from '../../../../../config/config';
import { DeviceService } from '../../../services/device.service';
import { GcmService } from '../../../services/gcm.service';
import { Route } from '../../../routing/route';
import { SettingsService } from '../../../services/settings.service';
import { Strings } from '../../../../../assets/strings/strings';
import { UrlHelper } from '../../../../common/url-helper';

/**
 * Component that allows the user to register their device.
 */
@Component({
    selector: 'add-device',
    templateUrl: './add-device.html',
    styleUrls: [ './add-device.css' ]
})
export class AddDeviceComponent {
    public readonly strings: Strings = new Strings();

    public isLoading: boolean = false;

    constructor(
        private readonly gcmService: GcmService,
        private readonly deviceService: DeviceService,
        private readonly router: Router,
        private readonly settingsService: SettingsService) { }

    public addDevice(name: string): Promise<any> {
        this.isLoading = true;

        // Use default device name if none was chosen
        if(!name) {
            name = this.strings.addDevice.defaultDeviceName;
        }

        return this.gcmService.register([Config.gcmSenderId])
            .then(gcmToken => {
                this.deviceService.addDevice({name: name, gcmToken: gcmToken, deviceType: DeviceType.chrome})
                    .then(() => this.settingsService.setInitialized())
                    .then(() => this.router.navigateByUrl(Route.selectDevice));
            })
            .catch(error => {
                // TODO Show some error message. Figure out how to do this in a uniform way
            })
    }
}