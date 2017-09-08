import { Device } from '../../../scripts/models/device';
import { ChromeStorageService } from '../../../scripts/options/services/chrome-storage.service';

export class MockChromeStorageService extends ChromeStorageService {

    public selectedDevice: Device;

    public getSelectedDevice(): Promise<Device> {
        return Promise.resolve(this.selectedDevice);
    }
}