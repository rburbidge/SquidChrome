import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import 'rxjs/add/operator/timeout';
import 'rxjs/add/operator/toPromise';

import { Device } from '../../../scripts/models/device';
import { DeviceService } from '../../../scripts/options/services/device.service';

interface GetDevices {
    (): Promise<Device[]>;
}

@Injectable()
export class MockDeviceService extends DeviceService {
    constructor() { super(null); }

    public getDevicesImpl: GetDevices;

    public getDevices(): Promise<Device[]> {
        return this.getDevicesImpl();
    }

    public sendUrlToDevice(deviceId: string): Promise<Response> {
        return Promise.resolve(null);
    }
};
