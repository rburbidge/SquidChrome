import { Injectable } from '@angular/core';
import { Device } from '../../models/device';

@Injectable()
export class ChromeStorageService {
    public getSelectedDevice(): Promise<Device> {
        return new Promise<Device>((resolve, reject) => {
            chrome.storage.sync.get(
                { device: null },
                (items: any) => {
                    if (chrome.runtime.lastError) {
                        reject(chrome.runtime.lastError);
                    }

                    resolve(items.device);
                });
        })
    }
}