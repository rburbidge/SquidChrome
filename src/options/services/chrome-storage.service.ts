import { Injectable } from '@angular/core';
import { DeviceModel } from '../../contracts/squid';

@Injectable()
export class ChromeStorageService {
    
    public setSelectedDevice(device: DeviceModel): Promise<void> {
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

    public getSelectedDevice(): Promise<DeviceModel> {
        return new Promise<DeviceModel>((resolve, reject) => {
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