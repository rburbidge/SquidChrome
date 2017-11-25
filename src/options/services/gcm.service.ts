import { Injectable } from '@angular/core';

@Injectable()
export class GcmService {
    public register(senderIds: string[]): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            chrome.gcm.register(
                senderIds,
                (registrationId) => {
                    if(chrome.runtime.lastError) {
                        reject(chrome.runtime.lastError);
                    } else {
                        resolve(registrationId);
                    }
                });
        });
    }
}