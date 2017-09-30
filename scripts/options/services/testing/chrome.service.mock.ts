import { ChromeService } from '../chrome.service';

export class MockChromeService extends ChromeService {
    public isDevMode(): boolean {
        return true;
    }
};