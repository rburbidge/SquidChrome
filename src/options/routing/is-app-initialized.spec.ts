import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { ChromeService } from '../services/chrome.service';
import { IsAppInitialized } from './is-app-initialized';
import { Route } from '../route';
import { Settings, SettingsService } from '../services/settings.service';

describe("IsAppInitialized", () => {

    let isAppInitialized: IsAppInitialized;
    let chromeService: ChromeService;
    let settings: Settings;
    let settingsService: SettingsService;
    let router: Router;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule],
            providers: [IsAppInitialized, ChromeService, SettingsService]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        isAppInitialized = TestBed.get(IsAppInitialized);
        chromeService = TestBed.get(ChromeService);
        router = TestBed.get(Router);
        settingsService = TestBed.get(SettingsService);
        settings = {
            initialized: false
        }
    });

    it('Returns true when user is signed into Chrome and is initialized', (done) => {
        settings.initialized = true;
        mockGetSettingsReturns(settings);
        mockIsSignedIntoChromeReturns(true);
        callActivate()
            .then(result => {
                expect(result).toBeFalsy();
                done();
            });
    });

    it('Redirects to sign-in when user is not signed into Chrome', (done) => {
        settings.initialized = true;
        mockGetSettingsReturns(settings);
        mockIsSignedIntoChromeReturns(false);
        let routerSpy = spyOn(router, 'navigateByUrl').and.callFake(() => {});   
        callActivate()
            .then(result => {
                expect(result).toBeFalsy();
                expect(routerSpy).toHaveBeenCalledWith(Route.signedOut);
                done();
            });
    });

    it('Redirects to intro when app is not initialized', (done) => {
        settings.initialized = false;
        mockGetSettingsReturns(settings);
        mockIsSignedIntoChromeReturns(true);
        let routerSpy = spyOn(router, 'navigateByUrl').and.callFake(() => {});
        callActivate()
            .then(result => {
                expect(result).toBeFalsy();
                expect(routerSpy).toHaveBeenCalledWith(Route.addDevice);
                done();
            });
    });

    function callActivate() {
        return (isAppInitialized.canActivate(null, null) as Promise<boolean>);
    }

    function mockIsSignedIntoChromeReturns(isSignedIn: boolean) {
        spyOn(chromeService, 'isSignedIntoChrome').and.returnValue(Promise.resolve(isSignedIn));
    }

    function mockGetSettingsReturns(settings: Settings) {
        spyOn(settingsService, 'getSettings').and.returnValue(Promise.resolve(settings));
    }
});