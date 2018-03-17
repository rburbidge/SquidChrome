import { Injectable } from '@angular/core';

import { DeviceModel } from '../../../contracts/squid';
import { ChromeDeviceModel, convertDeviceModel } from './squid-converter';

/**
 * The app settings.
 */
export interface Settings {
    /** The user's current set of devices, including this device. */
    devices: ChromeDeviceModel[];
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
            devices: null
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

                    settings.devices = settings.devices.map(convertDeviceModel);
                    resolve(settings);
                });
        });
    }

    public setDevices(devices: DeviceModel[]): Promise<void> {
        return this.set({ devices: devices });
    }

    /**
     * Set the app as initialized.
     */
    public setInitialized(): Promise<void> {
        return this.set({ initialized: true });
    }

    /**
     * Resets the app back to default settings.
     */
    public reset(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            chrome.storage.sync.clear(
                () => this.callRejectOnError(resolve, reject));
        });
    }

    private set(items: any): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            chrome.storage.sync.set(
                items,
                () => this.callRejectOnError(resolve, reject));
        });
    }

    /**
     * Calls reject(chrome.runtime.lastError) if there was an error; calls resolve(); otherwise.
     */
    private callRejectOnError(resolve, reject): void {
        if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
        }

        resolve();
    }
}