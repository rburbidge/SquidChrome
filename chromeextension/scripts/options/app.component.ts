import { Component, OnInit } from '@angular/core';

import { ChromeStorage } from '../common/chrome-storage';
import { Device } from '../models/device';
import { DeviceService } from './services/device.service';
import { SquidError } from '../models/squid-error';
import { SquidErrorCode } from '../models/squid-error-code';

@Component({
    selector: 'my-app',
    templateUrl: '../../templates/options.html',
    providers: [DeviceService]
})
export class AppComponent implements OnInit {
    constructor(private deviceService: DeviceService) { }

    public loadingDevices: boolean = true;
    public error: string;
    public devices: Device[];
    public selectedDevice?: Device;

    public setDevice(device: Device): void {
        chrome.storage.sync.set(
            { device: device },
            () => this.selectedDevice = device);
    }

    public isDeviceSelected(device: Device): boolean {
        return !!(this.selectedDevice && this.selectedDevice.id == device.id);
    }

    public refreshDevices(): void {
        this.loadingDevices = true;
        delete this.error;

        ChromeStorage.getSelectedDevice()
            .then((device) => this.selectedDevice = device)
            .catch((reason) => this.onError('Oops! An error occured while reading your settings. Try again later'));

        this.deviceService.getDevices()
            .then(devices => {
                this.devices = devices;
                this.loadingDevices = false;
            })
            .catch((error: SquidError) => {
                if(error.code == SquidErrorCode.UserNotFound) {
                    this.loadingDevices = false;
                    return;
                }

                this.onError('Oops! An error occurred while retrieving your devices. Try again later.');
            });
    }

    private onError(error: string): void {
        this.loadingDevices = false;
        this.error = error;
    }

    ngOnInit(): void {
        this.refreshDevices();
    }
}