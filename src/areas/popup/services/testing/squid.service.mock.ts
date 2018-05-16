import { SquidService } from '../squid.service';
import { ChromeDeviceModel } from '../squid-converter';
import { Observable } from 'rxjs/Observable';

export class MockSquidService extends SquidService {
    constructor() {
        super(null, null);
    }

    public getDevices(): Promise<ChromeDeviceModel[]> {
        return Promise.resolve(undefined);
    }

    public getDevicesCached(): Observable<ChromeDeviceModel[]> {
        return Observable.of(undefined);
    }
};
