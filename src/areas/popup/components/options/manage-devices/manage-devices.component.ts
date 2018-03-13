import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Strings } from '../../../../../assets/strings/strings';
import { ChromeDeviceModel } from '../../../services/squid-converter';
import { Route } from '../../../routing/route';

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
        this.router.navigate([ './' + device.id ], { relativeTo: this.route });
    }
}