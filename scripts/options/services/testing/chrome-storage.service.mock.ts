import { DeviceModel } from '../../../contracts/squid';
import { ChromeStorageService } from '../chrome-storage.service';

export class MockChromeStorageService extends ChromeStorageService {

    public selectedDevice: DeviceModel;

    public getSelectedDevice(): Promise<DeviceModel> {
        return Promise.resolve(this.selectedDevice);
    }
}