import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ChromeDeviceModel } from '../../../services/squid-converter';

/**
 * Allows the user to select a device to manage.
 */
@Component({
    selector: 'manage-devices',
    templateUrl: './manage-devices.html',
    styleUrls: ['./manage-devices.css']
})
export class ManageDevicesComponent {
    constructor(
        private readonly route: ActivatedRoute,
        private readonly router: Router) { }

    public onDeviceSelected(device: ChromeDeviceModel) {
        this.router.navigate(
            [
                './' + device.id,
                { deviceName: device.name, deviceIcon: device.getIcon() }
            ],
            { relativeTo: this.route });
    }
}