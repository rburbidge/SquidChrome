import { Component, OnInit } from '@angular/core';

import { ChromeStorageService } from './services/chrome-storage.service';
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
    constructor(private deviceService: DeviceService, private chromeStorageService: ChromeStorageService) { }

    public isLoading: boolean = true;
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

    public refreshDevices(): Promise<null> {
        this.isLoading = true;
        delete this.error;

        return new Promise((resolve, reject) => {
            let getSelectedDevice: Promise<Device> = this.chromeStorageService.getSelectedDevice();
            let getDevices: Promise<Device[]> = this.deviceService.getDevices();
            Promise.all([getSelectedDevice, getDevices])
                .then(values => {
                    this.selectedDevice = values[0];
                    this.devices = values[1];

                    this.isLoading = false;
                    resolve();
                })
                .catch((error: SquidError) => {
                    if (error.code == SquidErrorCode.UserNotFound) {
                        this.isLoading = false;
                    } else {
                        this.onError('Oops! An error occurred while retrieving your settings. Try again later.');
                    }
                    resolve();
                });
        });
    }

    private onError(error: string): void {
        this.isLoading = false;
        this.error = error;
    }

    ngOnInit(): void {
        this.refreshDevices();
    }
}