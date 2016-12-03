import { Component, OnInit } from '@angular/core';

import { ChromeStorage } from '../common/chrome-storage';
import { Device } from '../models/device';
import { DeviceService } from './services/device.service';

@Component({
    selector: 'my-app',
    templateUrl: '../../templates/options.html',
    providers: [DeviceService]
})
export class AppComponent implements OnInit {
    constructor(private deviceService: DeviceService) { }

    public loadingDevices: boolean = true;
    public selectedDevice: Device;
    public devices: Device[];
    public error: string;

    public setDevice(device: Device): void {
        chrome.storage.sync.set(
            { device: device },
            () => this.selectedDevice = device);
    }

    public isDeviceSelected(device: Device): boolean {
        return this.selectedDevice && this.selectedDevice.id == device.id;
    }

    private onError(error: string): void {
        this.loadingDevices = false;
        this.error = error;
    }

    ngOnInit(): void {
        ChromeStorage.getSelectedDevice()
            .then((device) => this.selectedDevice = device)
            .catch((reason) => this.onError("Oops! An error occured while reading your settings. Try again later"));

        this.deviceService.getDevices()
            .then(devices => {
                this.devices = devices;
                this.loadingDevices = false;
            })
            .catch((reason) => this.onError("Oops! An error occurred while retrieving your devices. Try again later."));
    }
}