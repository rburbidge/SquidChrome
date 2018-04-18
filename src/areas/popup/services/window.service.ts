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
     * Gets the location origin.
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