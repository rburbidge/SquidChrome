import { Component, Input, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Location } from '@angular/common';

import { Strings } from "../../../../../assets/strings/strings";
import { DeviceService } from "../../../services/device.service";
import { DeviceModel } from "../../../../../contracts/squid";
import { ChromeDeviceModel } from "../../../services/squid-converter";

/**
 * Shows options for a device.
 */
@Component({
    selector: 'device',
    templateUrl: './device.html',
    styleUrls: [ './device.css' ]
})
export class DeviceComponent implements OnInit {
    public readonly strings: Strings = new Strings();

    public device: ChromeDeviceModel;

    constructor(
        private readonly route: ActivatedRoute,
        private readonly location: Location,
        private readonly deviceService: DeviceService) { }

    public sendLink(): Promise<void> {
        return this.deviceService.sendUrl(this.device.id, 'https://www.google.com');
    }

    public remove(): Promise<void> {
        if(window.confirm(this.strings.device.removeConfirm(this.device.name))) {
            return this.deviceService.removeDevice(this.device.id)
                .then(() => this.location.back());
        }

        return Promise.resolve();
    }

    public ngOnInit(): Promise<void> {
        const deviceId = this.route.snapshot.params['deviceId'];
        return this.deviceService.getDevices()
            .then(devices => {
                this.device = devices.find(device => device.id == deviceId);
            });
    }
}