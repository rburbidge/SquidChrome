import { async, ComponentFixture, TestBed } from '@angular/core/testing';	
import { Router } from '@angular/router';	
import { RouterTestingModule } from '@angular/router/testing';	
	
import { IsAppInitialized } from './is-app-initialized';	
import { Route } from '../routing/route';	
import { SettingsService } from '../services/settings.service';	
	
describe("IsAppInitialized", () => {	
	
    let isAppInitialized: IsAppInitialized;	
    let router: Router;
    let settingsService: SettingsService;	
	
    beforeEach(async(() => {	
        TestBed.configureTestingModule({	
           imports: [RouterTestingModule],	
            providers: [IsAppInitialized, SettingsService]	
        })	
        .compileComponents();	
    }));	
	
    beforeEach(() => {	
        isAppInitialized = TestBed.get(IsAppInitialized);
        router = TestBed.get(Router);	
        settingsService = TestBed.get(SettingsService);

        spyOn(router, 'navigateByUrl').and.callFake(() => {});
    });
	
    it('Returns true when settings.thisDevice is set', () => {
        settingsService.settings.thisDevice = {} as any;
        testIsAppInitialized(undefined);	
    });	
	
    it('Redirects to intro when settings.thisDevice is not initialized', () => {	
        settingsService.settings.thisDevice = undefined;
        testIsAppInitialized(Route.intro.base);	
    });	
	
    function testIsAppInitialized(redirectRoute: string) {	
        const canActivate = isAppInitialized.canActivate(null, null);
        expect(canActivate).toBe(!redirectRoute);	

        if(redirectRoute) {	
            expect(router.navigateByUrl).toHaveBeenCalledWith(redirectRoute);	
        } else {
            expect(router.navigateByUrl).not.toHaveBeenCalled();
        }
    }
});