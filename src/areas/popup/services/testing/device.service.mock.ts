import { DeviceService } from '../device.service';
import { ChromeDeviceModel } from '../squid-converter';

export class MockDeviceService extends DeviceService {
    constructor() {
        super(null, null);
    }

    public getDevices(): Promise<ChromeDeviceModel[]> {
        return Promise.resolve(undefined);
    }
};
