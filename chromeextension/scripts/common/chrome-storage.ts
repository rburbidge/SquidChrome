import { Device } from '../models/device';

/**
 * Encapsulates chrome storage in a Promise-based interface.
 */
export class ChromeStorage {
    public static getSelectedDevice(): Promise<Device> {
        return new Promise<Device>((resolve, reject) => {
            chrome.storage.sync.get(
                { device: null },
                (items: any) => {
                    if(chrome.runtime.lastError) {
                        reject(chrome.runtime.lastError);
                    }

                    resolve(items.device);
                });
        })
    }
}