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
    public message: string;

    /** Returns the device icon for a device. */
    public getDeviceIcon(device: DeviceModel): string {
        switch(device.deviceType) {
            case DeviceType.chrome:
                return 'laptop';
            case DeviceType.android:
            default:
                return 'phone_android';
        }
    }

    private refreshMessage() {
        this.message = this.getMessage();
    }

    private getMessage(): string {
        if(!this.devices || this.devices.length == 0) {
            return this.strings.devices.noDevicesTitle;
        } else {
            return this.strings.devices.selectDevice;
        }
    }

    /**
     * Remove the a device, and delete it from the model set of devices.
     */
    public removeDevice(event: Event, device: DeviceModel): Promise<void> {
        event.stopPropagation();

        if(!confirm(this.strings.devices.deleteConfirm(device.name))) return;

        return this.deviceService.removeDevice(device.id)
            .then(() => {
                this.message = this.strings.devices.deleteComplete(device.name);
                this.devices.splice(
                    this.devices.findIndex((d: DeviceModel) => d.id === device.id),
                    1)
            })
            .catch(() => alert(this.strings.devices.deleteError));
    }

    /**
     * Sync both the selected device, and the other devices from the server.
     */
    public refreshDevices(): Promise<void> {
        this.isLoading = true;
        delete this.error;

        return this.deviceService.getDevices()
            .then(devices => {
                this.devices = devices;
                this.isLoading = false;

                this.refreshMessage();
            })
            .catch((error: ErrorModel) => {
                if (error && error.code == ErrorCode.UserNotFound) {
                    this.isLoading = false;
                    this.refreshMessage();
                } else {
                    this.onError(this.strings.devices.refreshError);
                }
            });
    }

    private onError(error: string): void {
        this.isLoading = false;
        this.error = error;
    }

    public ngOnInit(): Promise<void> {
        return this.refreshDevices();
    }
}