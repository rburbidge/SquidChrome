import $ from 'jquery';

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { Router } from '@angular/router';

import { ChromeService } from '../../services/chrome.service';
import { ChromeStorageService } from '../../services/chrome-storage.service';
import { DeviceModel } from '../../../contracts/squid';
import { DeviceService } from '../../services/device.service';
import { OptionsComponent } from '../../components/options/options.component';
import { MockChromeService } from '../../services/testing/chrome.service.mock';
import { MockChromeStorageService } from '../../services/testing/chrome-storage.service.mock';
import { MockDeviceService } from '../../services/testing/device.service.mock';
import { MockRouter } from '../../services/testing/router.mock';
import { Route } from '../../route';

describe('OptionsComponent', () => {
    let deviceService: DeviceService;
    let chromeService: ChromeService;
    let chromeStorageService: ChromeStorageService;
    let router: Router;

    let comp: OptionsComponent;
    let fixture: ComponentFixture<OptionsComponent>;

    /** Add styles to the page so that we can see what each test would look like in production. */
    beforeAll(() => {
        $('body').append(
            `<link rel="stylesheet" href="/base/scripts/css/squid.css" />
             <link rel="stylesheet" href="/base/scripts/css/lib/material-3.0.2.css" />
             <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
             <link rel="stylesheet" href="/base/node_modules/bootstrap/dist/css/bootstrap.min.css" />`);
    });

    beforeEach(async(() => {
        let mockRouter = {
            navigate: jasmine.createSpy('navigate'),
            navigateByUrl: () => {}
          };

        TestBed.configureTestingModule({
            declarations: [ OptionsComponent ],
            providers: [
                { provide: ChromeService, useValue: new MockChromeService() },
                { provide: ChromeStorageService, useValue: new MockChromeStorageService() },
                { provide: DeviceService, useValue: new MockDeviceService() },
                { provide: Router, useValue: mockRouter }
            ]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(OptionsComponent);
        comp = fixture.debugElement.componentInstance;

        deviceService = TestBed.get(DeviceService);
        chromeService = TestBed.get(ChromeService);
        chromeStorageService = TestBed.get(ChromeStorageService);
        router = TestBed.get(Router);
    })

    describe('constructor',() => {
        it('Has correct default values', function() {
            expect(comp.isLoading).toBeTruthy();
            expect(comp.error).toBeUndefined();
            expect(comp.devices.length).toBe(0);
            expect(comp.selectedDevice).toBeUndefined();
            expect(comp.message).toBeUndefined();
        });

        it('isDevMode is false when ChromeService says so', function() {
            testIsDevMode(false);
        });

        it('isDevMode is true when ChromeService says so', function() {
            testIsDevMode(true);
        });

        /** Tests that isDevMode is retrieved from ChromeService, and that the dev options panel is showing or hidden. */
        function testIsDevMode(expected: boolean) {
            spyOn(chromeService, 'isDevMode').and.returnValue(expected);
            fixture = TestBed.createComponent(OptionsComponent);
            comp = fixture.debugElement.componentInstance;
    
            // Dev options won't show if still loading
            comp.isLoading = false;
            fixture.detectChanges();
            const devOptions = fixture.debugElement.query(By.css('.squid-dev-options'));
    
            expect(comp.isDevMode).toBe(expected);
            if(expected) {
                expect(devOptions).toBeTruthy();
            } else {
                expect(devOptions).toBeNull();
            }
        }
    });

    describe('isDeviceSelected()', () => {
        it('Returns false when there is no selected device', function() {
            expect(comp.isDeviceSelected(null)).toBeFalsy();
            expect(comp.isDeviceSelected({ id: "id", name: "name" })).toBeFalsy();
        });
    
        it('Returns true when a device is selected and they share the same ID', function() {
            let device1 = { id: "id1", name: "doesn't matter" };
            let device2 = { id: "id2", name: "also doesn't matter" };
            comp.selectedDevice = device1;
            expect(comp.isDeviceSelected(device2)).toBeFalsy();
            expect(comp.isDeviceSelected(device1)).toBeTruthy();
        });
    });

    describe('refreshDevices()', () => {
        it('Stop loading on success', (done) => {
            let devices: DeviceModel[] = [
                { id: "id1", name: "Nexus 5X" },
                { id: "id3", name: "Pixel" },
                { id: "id2", name: "Samsung Galaxy" },
            ];
            spyOn(deviceService, 'getDevices').and.returnValue(Promise.resolve(devices));
            spyOn(chromeStorageService, 'getSelectedDevice').and.returnValue(Promise.resolve(devices[0]));
    
            comp.isLoading = false; // 1. Begin with loading = false
            comp.refreshDevices()
                .then(() => {
                    fixture.detectChanges();
                    expect(comp.isLoading).toBeFalsy(); // 3. Expect loading = false once complete
                    expect(comp.devices).toEqual(devices);
                    expect(comp.selectedDevice).toBe(devices[0]);
                    done();
                })
                .catch(() => {
                    fail();
                    done();
                });
            expect(comp.isLoading).toBeTruthy(); // 2. Expect loading = true from the refresh
        });
    
        it('Shows error if loading fails', (done) => {
            spyOn(deviceService, 'getDevices').and.returnValue(Promise.reject('An error'))
    
            comp.refreshDevices()
                .then(() => {
                    fixture.detectChanges();
                    let error = fixture.debugElement.query(By.css('.squid-error'));
                    expect(error.nativeElement.textContent).toContain('Oops! An error occurred while retrieving your settings. Try again later.');
                    done();
                })
                .catch(() => {
                    fail();
                });
        });
    });

    describe('ngInit()', () => {
        it('Redirects to SignedOutComponent when user is not signed into Chrome', (done) => {
            spyOn(chromeService, 'isSignedIntoChrome').and.returnValue(Promise.resolve(false));
            let routerSpy = spyOn(router, 'navigateByUrl').and.callFake(() => {});   

            comp.ngOnInit()
                .then(() => {
                    expect(routerSpy.calls.all()[0].args[0]).toBe(Route.signedOut);
                    done();
                })
                .catch(() => {
                    fail();
                    done();
                });
        });

        it('Calls OptionsComponent.refreshDevices() if user is signed into Chrome', (done) => {
            spyOn(chromeService, 'isSignedIntoChrome').and.returnValue(Promise.resolve(true));
            let compSpy = spyOn(comp, 'refreshDevices').and.callFake(() => {});   

            comp.ngOnInit()
                .then(() => {
                    expect(compSpy.calls.all().length).toBe(1);
                    done();
                })
                .catch(() => {
                    fail();
                    done();
                });
        });
    });
});