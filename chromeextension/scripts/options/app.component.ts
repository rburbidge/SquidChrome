import { Component, OnInit } from '@angular/core';

import { DeviceService } from './services/device.service';
import { Device } from './services/models/device';

@Component({
    selector: 'my-app',
    templateUrl: '../../templates/options.html',
    providers: [DeviceService]
})
export class AppComponent implements OnInit {
    constructor(private deviceService: DeviceService) { }

    public loadingDevices: boolean = true;
    private devices: Device[];

    ngOnInit(): void {
        this.deviceService.getDevices().then(devices => {
            this.devices = devices;
            this.loadingDevices = false;
        });
    }
}