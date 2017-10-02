import { Response } from '@angular/http';
import 'rxjs/add/operator/timeout';
import 'rxjs/add/operator/toPromise';

import { DeviceModel } from '../../../contracts/squid';
import { DeviceService } from '../device.service';

interface GetDevices {
    (): Promise<DeviceModel[]>;
}

export class MockDeviceService extends DeviceService {
    constructor() { super(null); }
};
