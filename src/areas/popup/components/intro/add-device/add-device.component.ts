import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { DeviceType } from '../../../../../contracts/squid';
import { Config } from '../../../../../config/config';
import { DeviceService } from '../../../services/device.service';
import { GcmService } from '../../../services/gcm.service';
import { Route } from '../../../routing/route';
import { SettingsService } from '../../../services/settings.service';
import { Strings } from '../../../../../assets/strings/strings';

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

        let newGcmToken: string;
        return this.gcmService.register([Config.gcmSenderId])
            .then(gcmToken => {
                newGcmToken = gcmToken;
                return this.deviceService.addDevice({name: name, gcmToken: newGcmToken, deviceType: DeviceType.chrome});
            })
            .then(newDevice => this.settingsService.setThisDevice(newDevice.id, newGcmToken))
            .then(() => this.deviceService.getDevices())
            .then(devices => {
                // Send user to SelectDeviceComponent if they had other devices; AddOtherDeviceComponent otherwise
                const selectDeviceRoute = Route.selectDevice;
                if(!devices || devices.length <=1) {
                    return this.router.navigate(
                        [Route.addAnotherDevice], { queryParams: { returnUrl: selectDeviceRoute } });
                } else {
                    return this.router.navigateByUrl(selectDeviceRoute);
                }
            })
            .catch(error => {
                // TODO Show some error message. Figure out how to do this in a uniform way
            });
    }
}