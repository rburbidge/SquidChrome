import { Component, EventEmitter, Output, OnInit, Input } from "@angular/core";

import { Strings } from "../../../../../assets/strings/strings";
import { SquidService } from "../../../services/squid.service";
import { ChromeDeviceModel } from "../../../services/squid-converter";
import { ErrorModel } from "../../../../../contracts/squid";
import { SettingsService } from "../../../services/settings.service";
import { NotificationsService } from "angular2-notifications";

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

    /** Whether or not to show this device. */
    @Input() showThisDevice: boolean = true;

    /** Whether or not to show the show add device button. */
    @Input() showAddDevice: boolean = false;
    
    @Output() readonly onLoad = new EventEmitter<ChromeDeviceModel[]>();
    @Output() readonly onError = new EventEmitter<ErrorModel>();
    @Output() readonly onDeviceClick = new EventEmitter<ChromeDeviceModel>();
    @Output() readonly onAddDeviceClick = new EventEmitter();

    constructor(
        private readonly squidService: SquidService,
        private readonly settingsService: SettingsService,
        private readonly notifications: NotificationsService) { }

    /**
     * Sync the devices from the server.
     */
    public refreshDevices(): void {
        this.isLoading = true;
        this.devices = undefined;

        this.squidService.getDevicesCached()
            .subscribe({
                next: (devices) => {
                    const thisDeviceId = this.settingsService.settings.thisDevice && this.settingsService.settings.thisDevice.id;
                    if(!this.showThisDevice && thisDeviceId) { // Filter out the current device                        
                        devices = devices.filter(device => device.id != thisDeviceId);
                    }
                    ChromeDeviceModel.sort(devices, thisDeviceId);

                    // Do not change loading state if there are no devices to show. Loading will be hidden either on
                    // the next emit, or in complete handler
                    this.isLoading = !devices || devices.length == 0;
                    this.devices = devices;

                    this.onLoad.emit(devices);
                },
                error: (error) => {
                    this.isLoading = false;
                    this.notifications.error(null, this.strings.devices.error.refreshFailed);
                    this.onError.emit(error);
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