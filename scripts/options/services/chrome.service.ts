import { Injectable } from '@angular/core';

@Injectable()
export class ChromeService {
    /**
     * Returns true if the extension was installed from an unpacked folder, rather than from a .crx file.
     */
    public isDevMode(): boolean {
        return !('update_url' in chrome.runtime.getManifest());
    }
}