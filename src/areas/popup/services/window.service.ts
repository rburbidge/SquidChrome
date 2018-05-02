import { Injectable } from '@angular/core';

@Injectable()
export class WindowService {
    /**
     * Sets the window URL.
     */
    public setUrl(url: string): void {
        window.location.href = url;
    }

    /**
     * Gets window.location.href.
     */
    public getLocationHref(): string {
        return window.location.href;
    }

    /**
     * Gets the window.location.origin.
     */
    public getOrigin(): string {
        return window.location.origin;
    }

    /**
     * Closes the window.
     */
    public close(): void {
        window.close();
    }
}