import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { ChromeService } from '../services/chrome.service';
import { IsAppInitialized } from './is-app-initialized';
import { Route } from '../routing/route';
import { Settings, SettingsService } from '../services/settings.service';

describe("IsAppInitialized", () => {

    let isAppInitialized: IsAppInitialized;
    let chromeService: ChromeService;
    let router: Router;
    let settings: Settings;
    let settingsService: SettingsService;

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
        testIsAppInitialized(true, true, undefined, done);
    });

    it('Redirects to sign-in when user is not signed into Chrome', (done) => {
        testIsAppInitialized(true, false, Route.introRoutes.signIn, done);
    });

    it('Redirects to intro when app is not initialized', (done) => {
        testIsAppInitialized(false, true, Route.introRoutes.registerDevice, done);
    });

    function testIsAppInitialized(isInitialized: boolean, isSignedIn: boolean, redirectRoute: string, done: Function) {
        settings.initialized = isInitialized;
        mockGetSettingsReturns(settings);
        mockIsSignedIntoChromeReturns(isSignedIn);
        let routerSpy = spyOn(router, 'navigateByUrl').and.callFake(() => {});

        (isAppInitialized.canActivate(null, null) as Promise<boolean>)
            .then(result => {
                expect(result).toBe(!redirectRoute);

                if(redirectRoute) {
                    expect(routerSpy).toHaveBeenCalledWith(redirectRoute);
                }
                done();
            });
    }

    function mockIsSignedIntoChromeReturns(isSignedIn: boolean) {
        spyOn(chromeService, 'isSignedIntoChrome').and.returnValue(Promise.resolve(isSignedIn));
    }

    function mockGetSettingsReturns(settings: Settings) {
        spyOn(settingsService, 'getSettings').and.returnValue(Promise.resolve(settings));
    }
});