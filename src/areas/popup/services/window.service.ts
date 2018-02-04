import { Injectable } from '@angular/core';

@Injectable()
export class WindowService {
    /**
     * Sets the window URL.
     */
    public setUrl(url: string): void {
        window.location.href = url;
    }
}