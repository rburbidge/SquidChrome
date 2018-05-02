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
            // Log at NavigationEnd in order to get the correct URL 
            if(event instanceof NavigationEnd) {
                const url = window.getLocationHref();
                console.log(url);
                this.telemetry.trackPageView(url);
            }
        })
    }
}