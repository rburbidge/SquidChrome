import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';	
import { Injectable } from '@angular/core';	
import { Observable } from 'rxjs/Observable';	
	
import { Route } from './route';
import { SettingsService } from '../services/settings.service';	
	
/**	
 * Guard for checking is user's device is registered
 */	
@Injectable()	
export class IsAppInitialized implements CanActivate {	
    constructor(	
        private router: Router,	
        private readonly settingsService: SettingsService) {	
    }	
	
    public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {	
        if(!this.settingsService.settings.thisDevice) {
            this.router.navigateByUrl(Route.intro.base);
            return false;
        }

        return true;
    }
}