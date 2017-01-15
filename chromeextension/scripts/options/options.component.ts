import { Component, OnInit } from '@angular/core';
import { UUID } from 'angular2-uuid';

import { ChromeStorageService } from './services/chrome-storage.service';
import { Config } from '../config';
import { Device } from '../models/device';
import { DeviceService } from './services/device.service';
import { SquidError } from '../models/squid-error';
import { SquidErrorCode } from '../models/squid-error-code';

@Component({
    selector: 'my-app',
    templateUrl: '../../templates/options.html',
    providers: [DeviceService]
})
export class OptionsComponent implements OnInit {
    constructor(private deviceService: DeviceService, private chromeStorageService: ChromeStorageService) { }

    public isDevMode: boolean = Config.isDevMode;
    public isLoading: boolean = true;
    public error: string;
    public devices: Device[];
    public selectedDevice?: Device;

    public setDevice(device: Device): void {
        this.selectedDevice = device;

        // TODO Check that storage was set correctly. Waiting on the callback before setting the selected device is
        // currently causing a bug where the data binding intermittently doesn't take effect
        chrome.storage.sync.set({ device: device });
    }

    public isDeviceSelected(device: Device): boolean {
        return !!(this.selectedDevice && this.selectedDevice.id == device.id);
    }

    /**
     * Add a fake device with an invalid GCM token. For testing purposes only.
     */
    public addDevice(): Promise<any> {
        let gcmToken = UUID.UUID();
        let name = 'Device ' + gcmToken.substring(0, 8); // Use only the first 8 chars of the token, for readability
        return this.deviceService.addDevice(name, gcmToken)
            .then(device => this.devices.push(device));
    }

    /**
     * Remove the a device, and delete it from the model set of devices.
     */
    public removeDevice(event: Event, device: Device): Promise<any> {
        event.stopPropagation();
        return this.deviceService.removeDevice(device.id)
            .then(() => this.devices.splice(
                this.devices.findIndex((d: Device) => d.id === device.id),
                1));
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