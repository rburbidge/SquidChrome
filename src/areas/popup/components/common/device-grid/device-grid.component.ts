import { Component, EventEmitter, Output, OnInit, Input } from "@angular/core";

import { Strings } from "../../../../../assets/strings/strings";
import { DeviceService } from "../../../services/device.service";
import { ChromeDeviceModel } from "../../../services/squid-converter";
import { ErrorModel } from "../../../../../contracts/squid";

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
    public devices: ChromeDeviceModel[] = [];
    public error: string;

    /** Whether or not to show the show add device button. */
    @Input() showAddDevice: boolean = false;
    
    @Output() readonly onLoad = new EventEmitter<ChromeDeviceModel[]>();
    @Output() readonly onError = new EventEmitter<ErrorModel>();
    @Output() readonly onDeviceClick = new EventEmitter<ChromeDeviceModel>();
    @Output() readonly onAddDeviceClick = new EventEmitter();

    constructor(private readonly deviceService: DeviceService) { }

    /**
     * Sync both the selected device, and the other devices from the server.
     */
    public refreshDevices(): void {
        this.isLoading = true;
        this.error = undefined;
        this.devices = undefined;

        this.deviceService.getDevices2()
            .subscribe({
                next: (devices) => {
                    this.isLoading = false;
                    this.devices = devices;
                    this.onLoad.emit(this.devices);
                },
                error: (error) => {
                    this.isLoading = false;
                    this.error = this.strings.devices.refreshError;
                    this.onError.emit(error)
                }
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

    public ngOnInit(): void {
        this.refreshDevices();
    }
}