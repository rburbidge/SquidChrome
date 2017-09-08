import { Component, OnInit } from '@angular/core';
import { UUID } from 'angular2-uuid';

import { ChromeStorageService } from './services/chrome-storage.service';
import { Config } from '../config';
import { Device } from '../models/device';
import { DeviceService } from './services/device.service';
import { ErrorCode, ErrorModel } from '../contracts/error-model';

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
    public devices: Device[] = [];
    public selectedDevice?: Device;
    public message: string;

    /**
     * Set the selected device.
     */
    public setDevice(device: Device): Promise<void> {
        // No-op if the device is already selected
        if (this.selectedDevice && this.selectedDevice.id == device.id) return;

        this.selectedDevice = device;
        this.refreshMessage();

        // TODO Check that storage was set correctly. Waiting on the callback before setting the selected device is
        // currently causing a bug where the data binding intermittently doesn't take effect
        return this.chromeStorageService.setSelectedDevice(device);
    }

    private refreshMessage() {
        this.message = this.getMessage();
    }

    private getMessage(): string {
        if (this.selectedDevice) {
            if (this.isSelectedDeviceUnregistered()) {
                if(this.devices && this.devices.length !== 0) {
                    return `${this.selectedDevice.name} was not found. Select a device`
                } else {
                    return `${this.selectedDevice.name} was not found`;
                }
            } else {
                return `Pages will be sent to ${this.selectedDevice.name}`
            }
        } else if(!this.devices || this.devices.length == 0) {
            return 'No devices found';
        } else {
            return 'Select a device';
        }
    }

    public isDeviceSelected(device: Device): boolean {
        return !!(this.selectedDevice && this.selectedDevice.id == device.id);
    }

    public isSelectedDeviceUnregistered(): boolean {
        if (!this.selectedDevice || !this.devices) return false;

        return !this.devices.find((device: Device): boolean => {
            return this.selectedDevice.id == device.id;
        });
    }

    /**
     * Add a fake device with an invalid GCM token. For testing purposes only.
     */
    public addDevice(): Promise<any> {
        let gcmToken = UUID.UUID();
        let name = 'Device ' + gcmToken.substring(0, 8); // Use only the first 8 chars of the token, for readability
        return this.deviceService.addDevice(name, gcmToken)
            .then(device => {
                this.devices.push(device);
                this.refreshMessage();
            });
    }

    /**
     * Remove the a device, and delete it from the model set of devices.
     */
    public removeDevice(event: Event, device: Device): Promise<any> {
        event.stopPropagation();
        if(this.selectedDevice && this.selectedDevice.id == device.id) {
            this.chromeStorageService.setSelectedDevice(null);
            delete this.selectedDevice;
        }

        return this.deviceService.removeDevice(device.id)
            .then(() => {
                this.message = `${device.name} has been deleted`;
                this.devices.splice(
                    this.devices.findIndex((d: Device) => d.id === device.id),
                    1)
            });
    }

    /**
     * Sync both the selected device, and the other devices from the server.
     */
    public refreshDevices(): Promise<void> {
        this.isLoading = true;
        delete this.error;

        return new Promise<void>((resolve, reject) => {
            let getSelectedDevice: Promise<Device> = this.chromeStorageService.getSelectedDevice();
            let getDevices: Promise<Device[]> = this.deviceService.getDevices();
            Promise.all([getSelectedDevice, getDevices])
                .then(values => {
                    this.selectedDevice = values[0];
                    this.devices = values[1];

                    this.isLoading = false;

                    this.refreshMessage();
                    resolve();
                })
                .catch((error: ErrorModel) => {
                    if (error.code == ErrorCode.UserNotFound) {
                        this.isLoading = false;
                        this.refreshMessage();
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