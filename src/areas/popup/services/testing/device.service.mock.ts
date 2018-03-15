import { DeviceService } from '../device.service';
import { ChromeDeviceModel } from '../squid-converter';
import { Observable } from 'rxjs/Observable';

export class MockDeviceService extends DeviceService {
    constructor() {
        super(null, null, null);
    }

    public getDevices(): Promise<ChromeDeviceModel[]> {
        return Promise.resolve(undefined);
    }

    public getDevices2(): Observable<ChromeDeviceModel[]> {
        return Observable.fromPromise(Promise.resolve(undefined));
    }
};
