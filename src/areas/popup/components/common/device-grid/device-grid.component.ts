import { Component, EventEmitter, Output, OnInit, Input } from "@angular/core";

import { Strings } from "../../../../../assets/strings/strings";
import { DeviceService } from "../../../services/device.service";
import { ChromeDeviceModel } from "../../../services/squid-converter";
import { ErrorModel } from "../../../../../contracts/squid";
import { SettingsService } from "../../../services/settings.service";

/**
 * Shows a grid of the user's devices.
 */
@Component({
    selector: 'device-grid',
    templateUrl: './device-grid.html',
    styleUrls: [ './device-grid.css' ]
})
export class DeviceGridComponent implements OnInit {
    public readonly strings: Strings = new Strings();
    public isLoading: boolean = true;
    public devices: ChromeDeviceModel[];
    public error: string;

    /** Whether or not to show this device. */
    @Input() showThisDevice: boolean = true;

    /** Whether or not to show the show add device button. */
    @Input() showAddDevice: boolean = false;
    
    @Output() readonly onLoad = new EventEmitter<ChromeDeviceModel[]>();
    @Output() readonly onError = new EventEmitter<ErrorModel>();
    @Output() readonly onDeviceClick = new EventEmitter<ChromeDeviceModel>();
    @Output() readonly onAddDeviceClick = new EventEmitter();

    constructor(
        private readonly deviceService: DeviceService,
        private readonly settingsService: SettingsService) { }

    /**
     * Sync the devices from the server.
     */
    public refreshDevices(): void {
        this.isLoading = true;
        this.error = undefined;
        this.devices = undefined;

        this.deviceService.getDevicesCached()
            .subscribe({
                next: (devices) => {
                    this.devices = devices;
                    if(!this.showThisDevice) { // Filter out the current device
                        const thisDeviceId = this.settingsService.settings.thisDevice && this.settingsService.settings.thisDevice.id;
                        this.devices = this.devices.filter(device => device.id != thisDeviceId);
                    }

                    // Do not change loading state if there are no devices to show. Loading will be hidden either on
                    // the next emit, or in complete handler
                    this.isLoading = !this.devices || this.devices.length == 0;
                    this.onLoad.emit(this.devices);
                },
                error: (error) => {
                    this.isLoading = false;
                    this.error = this.strings.devices.refreshError;
                    this.onError.emit(error)
                },
                complete: () => this.isLoading = false
            });
    }

    /**
     * Whether or not to show a filler device in the grid.
     * 
     * This is required for the layout to be a proper grid.
     */
    public showFillerDevice(): boolean {
        if(this.devices.length % 2 == 0) {
            return this.showAddDevice;
        }

        return !this.showAddDevice;
    }

    /**
     * Returns true if the input device is the current device.
     * @return false if the current device is not defined.
     */
    public isThisDevice(device: ChromeDeviceModel): boolean {
        const thisDevice = this.settingsService.settings.thisDevice;
        if(!thisDevice) return false;
        return thisDevice.id == device.id;
    }

    public ngOnInit(): void {
        this.refreshDevices();
    }
}