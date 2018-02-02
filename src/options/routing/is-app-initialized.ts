import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { ChromeService } from '../services/chrome.service';
import { Route } from '../route';
import { SettingsService } from '../services/settings.service';

@Injectable()
export class IsAppInitialized implements CanActivate {
    constructor(
        private router: Router,
        private readonly chromeService: ChromeService,
        private readonly settingsService: SettingsService) {
    }

    public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
        const getSettings = this.settingsService.getSettings()
        const getIsSignedIn = this.chromeService.isSignedIntoChrome();

        return Promise.all([getSettings, getIsSignedIn])
            .then(results => {
                const isInitialized = results[0].initialized;
                const isSignedIn = results[1];

                // Determine if we need to navigate to another route
                let route: string;
                if(!isSignedIn) {
                    route = Route.signedOut;
                } else if(!isInitialized)  {
                    route = Route.addDevice;
                }

                // Return true if we don't need to navigate to another route
                if(route) {
                    this.router.navigateByUrl(route);
                    return false;
                } else {
                    return true;
                }
            })
            .catch(reason => {
                console.warn('ChromeService.isSignedIntoChrome() threw ' + reason);
                // TODO Redirect the user to "Something went wrong" page
                return false;
            });
    }
}