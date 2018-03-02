import { Component, EventEmitter, Output, OnInit } from "@angular/core";

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

    @Output() onLoad = new EventEmitter();
    @Output() onError = new EventEmitter<ErrorModel>();
    @Output() onDeviceClick = new EventEmitter<ChromeDeviceModel>();
    @Output() onAddDeviceClick = new EventEmitter();

    constructor(private readonly deviceService: DeviceService) { }

    public isLoading: boolean = true;
    public devices: ChromeDeviceModel[] = [];

    /**
     * Sync both the selected device, and the other devices from the server.
     */
    public refreshDevices(): Promise<void> {
        this.isLoading = true;

        return this.deviceService.getDevices()
            .then(devices => {
                this.devices = devices;
                this.isLoading = false;
                this.onLoad.emit();
            })
            .catch((error: ErrorModel) => this.onError.emit(error));
    }

    ngOnInit(): void {
        this.refreshDevices();
    }
}