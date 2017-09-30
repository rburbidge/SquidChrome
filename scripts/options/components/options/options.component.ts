import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UUID } from 'angular2-uuid';

import { ChromeService } from '../../services/chrome.service';
import { ChromeAuthHelper } from '../../../common/chrome-auth-helper';
import { ChromeStorageService } from '../../services/chrome-storage.service';
import { Config } from '../../../config';
import { DeviceModel, ErrorCode, ErrorModel } from '../../../contracts/squid';
import { DeviceService } from '../../services/device.service';
import { Route } from '../../route';

/**
 * The options page. Allows the user to manage their registered devices.
 */
@Component({
    selector: 'options',
    templateUrl: './options.html'
})
export class OptionsComponent implements OnInit {
    constructor(
        private readonly deviceService: DeviceService,
        private readonly router: Router,
        private readonly chromeService: ChromeService,
        private readonly chromeStorageService: ChromeStorageService)
    {
        this.isDevMode = chromeService.isDevMode();
    }

    public isDevMode: boolean;
    public isLoading: boolean = true;
    public error: string;
    public devices: DeviceModel[] = [];
    public selectedDevice?: DeviceModel;
    public message: string;

    /**
     * Set the selected device.
     */
    public setDevice(device: DeviceModel): Promise<void> {
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

    public isDeviceSelected(device: DeviceModel): boolean {
        return !!(this.selectedDevice && this.selectedDevice.id == device.id);
    }

    public isSelectedDeviceUnregistered(): boolean {
        if (!this.selectedDevice || !this.devices) return false;

        return !this.devices.find((device: DeviceModel): boolean => {
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
    public removeDevice(event: Event, device: DeviceModel): Promise<any> {
        event.stopPropagation();
        if(this.selectedDevice && this.selectedDevice.id == device.id) {
            this.chromeStorageService.setSelectedDevice(null);
            delete this.selectedDevice;
        }

        return this.deviceService.removeDevice(device.id)
            .then(() => {
                this.message = `${device.name} has been deleted`;
                this.devices.splice(
                    this.devices.findIndex((d: DeviceModel) => d.id === device.id),
                    1)
            })
            .catch(() => {
                alert("An error occurred while removing the device. Please try again later.");
            });
    }

    /**
     * Sync both the selected device, and the other devices from the server.
     */
    public refreshDevices(): Promise<void> {
        this.isLoading = true;
        delete this.error;

        return new Promise<void>((resolve, reject) => {
            let getSelectedDevice: Promise<DeviceModel> = this.chromeStorageService.getSelectedDevice();
            let getDevices: Promise<DeviceModel[]> = this.deviceService.getDevices();
            Promise.all([getSelectedDevice, getDevices])
                .then(values => {
                    this.selectedDevice = values[0];
                    this.devices = values[1];

                    this.isLoading = false;

                    this.refreshMessage();
                    resolve();
                })
                .catch((error: ErrorModel) => {
                    if (error && error.code == ErrorCode.UserNotFound) {
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
        this.chromeService.isSignedIntoChrome()
            .then((signedIn: boolean) => {
                if(signedIn) {
                    this.refreshDevices();
                } else {
                    this.router.navigateByUrl(Route.signedOut);
                }
            })
            .catch(reason => {
                console.log('ChromeService.isSignedIntoChrome() threw ' + reason);
                this.onError('Oops! An error occurred while retrieving your settings. Try again later.');
            });
    }
}