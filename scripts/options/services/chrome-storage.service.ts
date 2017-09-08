import { Injectable } from '@angular/core';
import { Device } from '../../models/device';

@Injectable()
export class ChromeStorageService {
    
    public setSelectedDevice(device: Device): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            chrome.storage.sync.set({ device: device },
                () => {
                    if (chrome.runtime.lastError) {
                        reject(chrome.runtime.lastError);
                    }

                    resolve();
                });
        });
    }

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
        });
    }
}