import { ChromeService } from '../../../scripts/options/services/chrome.service';
import { Injectable } from '@angular/core';

@Injectable()
export class MockChromeService extends ChromeService {
    public isDevMode(): boolean {
        return true;
    }
};