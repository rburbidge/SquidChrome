import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { Router } from '@angular/router';

import { ChromeService } from '../../services/chrome.service';
import { DeveloperComponent } from '../developer/developer.component';
import { DeviceModel, DeviceType, ErrorCode, ErrorModel } from '../../../../contracts/squid';
import { DeviceService } from '../../services/device.service';
import { loadCss } from '../testing/css-loader';
import { SelectDeviceComponent } from './select-device.component';
import { MockChromeService } from '../../services/testing/chrome.service.mock';
import { MockDeviceService } from '../../services/testing/device.service.mock';
import { RouterTestingModule } from '@angular/router/testing';
import { Settings, SettingsService } from '../../services/settings.service';
import { WindowService } from '../../services/window.service';
import { ChromeDeviceModel } from '../../services/squid-converter';
import { Route } from '../../routing/route';
import { ToolbarComponent } from '../toolbar/toolbar.component';

describe('SelectDeviceComponent', () => {
    let deviceService: DeviceService;
    let chromeService: ChromeService;
    let settings: Settings;
    let settingsService: SettingsService;
    let router: Router;
    let windowService: WindowService;

    let comp: SelectDeviceComponent;
    let fixture: ComponentFixture<SelectDeviceComponent>;

    let getSettings: jasmine.Spy;

    beforeAll(() => {
        loadCss();
    });

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ DeveloperComponent, SelectDeviceComponent, ToolbarComponent],
            imports: [ RouterTestingModule ],
            providers: [
                { provide: ChromeService, useValue: new MockChromeService() },
                { provide: SettingsService, useValue: new SettingsService() },
                { provide: DeviceService, useValue: new MockDeviceService() },
                { provide: WindowService, useValue: new WindowService() }
            ]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SelectDeviceComponent);
        comp = fixture.debugElement.componentInstance;

        deviceService = TestBed.get(DeviceService);
        chromeService = TestBed.get(ChromeService);
        settingsService = TestBed.get(SettingsService);
        router = TestBed.get(Router);
        windowService = TestBed.get(WindowService);

        // Mock the settings object. If a test wants to override settings, it can modify this object
        settings = {
            initialized: true
        };
        getSettings = spyOn(settingsService, 'getSettings').and.returnValue(Promise.resolve(settings));
    })

    describe('constructor',() => {
        it('Has correct default values', function() {
            expect(comp.isLoading).toBeTruthy();
            expect(comp.error).toBeUndefined();
            expect(comp.devices.length).toBe(0);
            expect(comp.message).toBeUndefined();
        });
    });

    describe('sendUrl()', () => {
        it('Sends a URL to the device', (done) => {
            let sendUrl = spyOn(deviceService, 'sendUrl').and.returnValue(Promise.resolve());
            const url = 'https://www.example.com';
            let getCurrentTabUrl = spyOn(chromeService, 'getCurrentTabUrl').and.returnValue(Promise.resolve(url));
            let windowClose = spyOn(windowService, 'close');

            const device = createDevice();
            comp.sendUrl(device)
                .then(() => {
                    expect(getCurrentTabUrl).toHaveBeenCalledTimes(1);
                    expect(sendUrl).toHaveBeenCalledWith(device.id, url);
                    expect(windowClose).toHaveBeenCalledTimes(1);
                    done();
                })
        });
    });

    describe('refreshDevices()', () => {
        it('Shows devices on success', (done) => {
            mockGetDevicesReturns(devices);
            
            spyOn(comp, 'ngOnInit').and.returnValue(Promise.resolve()); // Fake ngOnInit() to prevent it from interfering with refreshDevices() results

            comp.isLoading = false; // 1. Begin with loading = false and an error
            comp.error = 'Some random error';
            
            comp.refreshDevices()
                .then(() => {
                    fixture.detectChanges();
                    expect(comp.isLoading).toBeFalsy(); // 3. Expect loading = false once complete
                    expect(comp.error).toBeUndefined();
                    expect(comp.devices).toEqual(devices);
                    done();
                });
            expect(comp.isLoading).toBeTruthy(); // 2. Expect loading = true and that the error was cleared
            expect(comp.error).toBeUndefined();
        });
    
        it('Shows error if loading fails', (done) => {
            spyOn(deviceService, 'getDevices').and.returnValue(Promise.reject('An error'));
            mockIsSignedIntoChromeReturns(true);

            fixture.detectChanges();
            comp.refreshDevices()
                .then(() => {
                    testErrorShown('Oops! An error occurred while retrieving your settings. Try again later.');
                    done();
                }).catch(e => {
                    console.log(e);
                });
        });

        it('Redirects to intro if undefined devices', (done) => {
            mockGetDevicesReturns(undefined);
            testRedirectToIntro()
                .then(() => done());
        });

        it('Redirects to intro if empty devices', (done) => {
            mockGetDevicesReturns([]);
            testRedirectToIntro()
                .then(() => done());
        });

        it('Redirects to intro if app not initialized', (done) => {
            spyOn(deviceService, 'getDevices').and.returnValue(Promise.reject('An error'));

            settings.initialized = false;
            let isSignedIntoChrome = mockIsSignedIntoChromeReturns(true);

            testRedirectToIntro()
                .then(() => {
                    expect(getSettings).toHaveBeenCalledTimes(1);
                    expect(isSignedIntoChrome).toHaveBeenCalledTimes(1);
                    done();
                });
        });

        it('Redirects to intro if user not signed in',  (done) => {
            spyOn(deviceService, 'getDevices').and.returnValue(Promise.reject('An error'));

            settings.initialized = true;
            let isSignedIntoChrome = mockIsSignedIntoChromeReturns(false);

            testRedirectToIntro()
                .then(() => done());
        });

        it('Redirects to intro if user not found', (done) => {
            const errorModel: ErrorModel = {
                code: ErrorCode.UserNotFound,
                codeString: null,
                message: null
            };
            spyOn(deviceService, 'getDevices').and.returnValue(Promise.reject(errorModel));

            settings.initialized = true;
            let isSignedIntoChrome = mockIsSignedIntoChromeReturns(true);

            testRedirectToIntro()
                .then(() => done());
        });

        function testRedirectToIntro(): Promise<void> {
            let routerNavigateByUrl = spyOn(router, 'navigateByUrl');

            return comp.refreshDevices()
                .then(() => {
                    expect(routerNavigateByUrl).toHaveBeenCalledWith(Route.intro.base);
                });
        }
    });

    const devices: ChromeDeviceModel[] = [
        { id: "id1", name: "Nexus 5X", deviceType: DeviceType.android, getIcon: () => "Icon" },
        { id: "id3", name: "Pixel", deviceType: DeviceType.android, getIcon: () => "Icon" },
        { id: "id2", name: "Samsung Galaxy", deviceType: DeviceType.android, getIcon: () => "Icon" },
    ];

    function createDevice(): ChromeDeviceModel {
        return {
            id: "id1",
            name: "Nexus 5X",
            deviceType: DeviceType.android,
            getIcon: () => 'Icon'
        };
    }

    function mockGetDevicesReturns(devices: DeviceModel[]): jasmine.Spy {
        return spyOn(deviceService, 'getDevices').and.returnValue(Promise.resolve(devices))
    }

    function mockIsSignedIntoChromeReturns(isSignedIn: boolean): jasmine.Spy {
        return spyOn(chromeService, 'isSignedIntoChrome').and.returnValue(Promise.resolve(isSignedIn));
    }

    function testErrorShown(expectedError: string) {
        expect(comp.isLoading).toBe(false);
        expect(comp.error).toBe(expectedError);
        fixture.detectChanges();
        let error = fixture.debugElement.query(By.css('.squid-error'));
        expect(error).toBeTruthy();
        expect(error.nativeElement.textContent).toContain(expectedError);
    }

    function testHeaderTextShown(expectedText) {
        fixture.detectChanges();
        let header = fixture.debugElement.query(By.css('.squid-options-header'));
        expect(header.nativeElement.textContent).toContain(expectedText);
    }

    function setupCompWithDevices(devices: DeviceModel[]): Promise<void> {
        mockGetDevicesReturns(devices);

        return comp.ngOnInit();
    }
});