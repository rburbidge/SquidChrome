import { Component, Injector } from '@angular/core';
import { TelemetryService } from '../../services/telemetry.service';
import { WindowService } from '../../services/window.service';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';

@Component({
    selector: 'my-app',
    template: `
        <router-outlet></router-outlet>
        <simple-notifications></simple-notifications>
    `
})
export class AppComponent {

    constructor(
        private readonly telemetry: TelemetryService,
        private readonly window: WindowService,
        private readonly router: Router)
    {
        router.events.forEach((event) => {
            if(event instanceof NavigationEnd) {
                this.onNavigationEnd();
            }
        })
    }

    /**
     * Track page views.
     * 
     * Do this on end navigation end event because this retrieves the correct resulting URL.
     */
    private onNavigationEnd(): void {
        // Log at NavigationEnd in order to get the correct URL
        const url = this.window.getLocationHref();

        console.log(url);
        this.telemetry.trackPageView(url);
    }
}