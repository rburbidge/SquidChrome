import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ChromeService } from '../../services/chrome.service';
import { ChromeAuthHelper } from '../../../common/chrome-auth-helper';
import { Config } from '../../../config';
import { DeviceModel, DeviceType, ErrorCode, ErrorModel } from '../../../contracts/squid';
import { DeviceService } from '../../services/device.service';
import { Route } from '../../route';
import { SettingsService } from '../../services/settings.service';
import { Strings } from '../../../content/strings';
import { UrlHelper } from '../../../common/url-helper';

/**
 * The options page. Allows the user to manage their registered devices.
 */
@Component({
    selector: 'options',
    templateUrl: './options.html'
})
export class OptionsComponent implements OnInit {

    public readonly strings: Strings = new Strings();

    constructor(
        private readonly deviceService: DeviceService,
        private readonly router: Router,
        private readonly chromeService: ChromeService,
        private readonly settingsService: SettingsService)
    {
        this.isDevMode = chromeService.isDevMode();
    }

    public isDevMode: boolean;
    public isLoading: boolean = true;
    public error: string;
    public devices: DeviceModel[] = [];
    public selectedDevice?: DeviceModel = null;
    public message: string;

    /**
     * Set the selected device.
     */
    public setDevice(device: DeviceModel): Promise<void> {
        // No-op if the device is already selected
        if (this.selectedDevice && this.selectedDevice.id == device.id) return;

        return this.settingsService.setSelectedDevice(device)
            .then(() => {
                this.selectedDevice = device;
                this.refreshMessage();
            });
    }

    /** Returns the device icon for a device. */
    public getDeviceIcon(device: DeviceModel): string {
        switch(device.deviceType) {
            case DeviceType.Chrome:
                return 'laptop';
            case DeviceType.Android:
            default:
                return 'phone_android';
        }
    }

    private refreshMessage() {
        this.message = this.getMessage();
    }

    private getMessage(): string {
        if (this.selectedDevice) {
            if (this.isSelectedDeviceUnregistered()) {
                if(this.devices && this.devices.length !== 0) {
                    return this.strings.devices.selectedDeviceNotFoundSelect(this.selectedDevice.name);
                } else {
                    return this.strings.devices.selectedDeviceNotFound(this.selectedDevice.name);
                }
            } else {
                return this.strings.devices.selectDeviceComplete(this.selectedDevice.name)
            }
        } else if(!this.devices || this.devices.length == 0) {
            return this.strings.devices.noDevicesTitle;
        } else {
            return this.strings.devices.selectDevice;
        }
    }

    public isDeviceSelected(device: DeviceModel): boolean {
        return !!(this.selectedDevice && this.selectedDevice.id == device.id);
    }

    public isSelectedDeviceUnregistered(): boolean {
        if (!this.selectedDevice || !this.devices) return false;

        return !this.devices.find(
            device => device.id == this.selectedDevice.id);
    }

    /**
     * Remove the a device, and delete it from the model set of devices.
     */
    public removeDevice(event: Event, device: DeviceModel): Promise<void> {
        event.stopPropagation();

        if(!confirm(this.strings.devices.deleteConfirm(device.name))) return;

        // Delete the device from Chrome storage if it is currently the selected device
        let deleteSelectedDevice: Promise<void>;
        if(this.selectedDevice && this.selectedDevice.id == device.id) {
            deleteSelectedDevice = this.settingsService.setSelectedDevice(null)
                .then(() => {
                    delete this.selectedDevice;
                });
        } else {
            deleteSelectedDevice = Promise.resolve();
        }

        // Delete the device from the server
        const removeDevice = this.deviceService.removeDevice(device.id)
            .then(() => {
                this.message = this.strings.devices.deleteComplete(device.name);
                this.devices.splice(
                    this.devices.findIndex((d: DeviceModel) => d.id === device.id),
                    1)
            });

        return Promise.all([deleteSelectedDevice, removeDevice])
            .then(d => undefined)
            .catch(() => alert(this.strings.devices.deleteError))
    }

    /**
     * Sync both the selected device, and the other devices from the server.
     */
    public refreshDevices(): Promise<void> {
        this.isLoading = true;
        delete this.error;

        return new Promise<void>((resolve, reject) => {
            let getSelectedDevice: Promise<DeviceModel> = this.settingsService.getSettings()
                .then(settings => settings.device);
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
                        this.onError(this.strings.devices.refreshError);
                    }
                    resolve();
                });
        });
    }

    private onError(error: string): void {
        this.isLoading = false;
        this.error = error;
    }

    public ngOnInit(): Promise<void> {
        const getSettings = this.settingsService.getSettings()
        const getIsSignedIn = this.chromeService.isSignedIntoChrome();

        return Promise.all([getSettings, getIsSignedIn])
            .then(results => {
                const isInitialized = results[0].initialized;
                const isSignedIn = results[1];

                if(isInitialized && isSignedIn) {
                    return this.refreshDevices();
                }

                let route: string;
                if(!isSignedIn) {
                    route = Route.signedOut;
                } else {
                    route = Route.addDevice;
                }

                if(!route) return;
                this.router.navigateByUrl(route);
            })
            .catch(reason => {
                console.warn('ChromeService.isSignedIntoChrome() threw ' + reason);
                this.onError(this.strings.devices.refreshError);
            });
    }
}