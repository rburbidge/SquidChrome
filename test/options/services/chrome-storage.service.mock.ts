import { DeviceModel } from '../../../scripts/contracts/squid';
import { ChromeStorageService } from '../../../scripts/options/services/chrome-storage.service';

export class MockChromeStorageService extends ChromeStorageService {

    public selectedDevice: DeviceModel;

    public getSelectedDevice(): Promise<DeviceModel> {
        return Promise.resolve(this.selectedDevice);
    }
}