import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import 'rxjs/add/operator/timeout';
import 'rxjs/add/operator/toPromise';

import { Device } from '../../../scripts/models/device';
import { DeviceService } from '../../../scripts/options/services/device.service';

@Injectable()
export class MockDeviceService extends DeviceService {
    constructor() { super(null); }

    public getDevices(): Promise<Device[]> {
        return Promise.resolve([]);
    }

    public sendUrlToDevice(deviceId: string): Promise<Response> {
        return Promise.resolve(null);
    }
};
