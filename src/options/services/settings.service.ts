import { Injectable } from '@angular/core';

import { callRejectOnError } from '../../common/chrome-promise';
import { DeviceModel } from '../../contracts/squid';

/**
 * The app settings.
 */
export interface Settings {
    /**
     * True iff the app has been initialized before.
     */
    initialized: boolean;
}

/**
 * Abstraction for settings, stored in chrome.storage.sync.
 * @see https://developer.chrome.com/apps/storage
 */
@Injectable()
export class SettingsService {
    
    /**
     * Creates the default settings. Used by production and test code.
     */
    public static createDefault(): Settings {
        // NOTE: All object-type fields should be null, not undefined. This is used to retrieve settings from Chrome
        // Storage. If a field is undefined, then it will not be retrieved.
        return {
            initialized: false
        }
    };

    /**
     * Gets the settings from chrome storage.
     * 
     * This can be split into separate APIs in the future if the app ends up having a large amount of settings.
     */
    public getSettings(): Promise<Settings> {
        return new Promise<Settings>((resolve, reject) => {
            chrome.storage.sync.get(
                SettingsService.createDefault(),
                (settings: Settings) => {
                    if (chrome.runtime.lastError) {
                        reject(chrome.runtime.lastError);
                    }

                    resolve(settings);
                });
        });
    }

    /**
     * Sets the selected device.
     */
    public setSelectedDevice(device: DeviceModel): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            chrome.storage.sync.set(
                { device: device },
                () => callRejectOnError(resolve, reject));
        });
    }

    /**
     * Set the app as initialized.
     */
    public setInitialized(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            chrome.storage.sync.set(
                { initialized: true },
                () => callRejectOnError(resolve, reject));
        });
    }

    /**
     * Resets the app back to default settings.
     */
    public reset(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            chrome.storage.sync.clear(
                () => callRejectOnError(resolve, reject));
        });
    }

}