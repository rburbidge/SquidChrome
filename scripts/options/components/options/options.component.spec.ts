import $ from 'jquery';

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { Router } from '@angular/router';

import { ChromeService } from '../../services/chrome.service';
import { ChromeStorageService } from '../../services/chrome-storage.service';
import { DeviceModel, ErrorCode, ErrorModel } from '../../../contracts/squid';
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

    describe('setDevice()', () => {
        it('Sets the selected device', (done) => {
            const setSelectedDeviceSpy = spyOn(chromeStorageService, 'setSelectedDevice').and.returnValue(Promise.resolve());
            
            setupCompWithDevices(devices, undefined)
                .then(() => comp.setDevice(devices[0]))
                .then(() => {
                    testHeaderTextShown(`Pages will be sent to ${devices[0].name}`);

                    expect(comp.selectedDevice).toBe(devices[0]);
                    expect(setSelectedDeviceSpy).toHaveBeenCalledWith(devices[0]);
                    done();
                });
        });
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
        it('Shows devices and selected device on success', (done) => {
            mockGetDevicesReturns(devices);
            mockGetSelectedDeviceReturns(devices[1]);
            spyOn(comp, 'ngOnInit').and.returnValue(Promise.resolve()); // Fake ngOnInit() to prevent it from interfering with refreshDevices() results

            comp.isLoading = false; // 1. Begin with loading = false and an error
            comp.error = 'Some random error';
            
            comp.refreshDevices()
                .then(() => {
                    fixture.detectChanges();
                    expect(comp.isLoading).toBeFalsy(); // 3. Expect loading = false once complete
                    expect(comp.error).toBeUndefined();
                    expect(comp.devices).toEqual(devices);
                    expect(comp.selectedDevice).toBe(devices[1]);
                    done();
                });
            expect(comp.isLoading).toBeTruthy(); // 2. Expect loading = true and that the error was cleared
            expect(comp.error).toBeUndefined();
        });

        it('Shows no selected device when the user hasn\'t selected a device yet', (done) => {
            mockGetDevicesReturns(devices);
            mockGetSelectedDeviceReturns(undefined);
            spyOn(comp, 'ngOnInit').and.returnValue(Promise.resolve()); // Fake ngOnInit() to prevent it from interfering with refreshDevices() results

            comp.isLoading = false; // 1. Begin with loading = false and an error
            comp.error = 'Some random error';
            
            comp.refreshDevices()
                .then(() => {
                    fixture.detectChanges();
                    expect(comp.isLoading).toBeFalsy(); // 3. Expect loading = false once complete
                    expect(comp.error).toBeUndefined();
                    expect(comp.devices).toEqual(devices);
                    expect(comp.selectedDevice).toBe(undefined);
                    done();
                });
            expect(comp.isLoading).toBeTruthy(); // 2. Expect loading = true and that the error was cleared
            expect(comp.error).toBeUndefined();
        });

        it('Shows message when the user has no devices', (done) => {
            mockGetDevicesReturns([]);
            mockGetSelectedDeviceReturns(undefined);
    
            comp.refreshDevices()
                .then(() => {
                    testNoDevicesFound();
                    done();
                });
        });

        it('Shows message on UserNotFound error', (done) => {
            const error: ErrorModel = {
                code: ErrorCode.UserNotFound,
                codeString: '',
                message: ''
            };
            spyOn(deviceService, 'getDevices').and.returnValue(Promise.reject(error))
            mockGetSelectedDeviceReturns(undefined);
    
            comp.refreshDevices()
                .then(() => {
                    testNoDevicesFound();
                    done();
                });
        });
    
        it('Shows error if loading fails', (done) => {
            spyOn(deviceService, 'getDevices').and.returnValue(Promise.reject('An error'))
            mockGetSelectedDeviceReturns(undefined);
    
            comp.refreshDevices()
                .then(() => {
                    testErrorShown('Oops! An error occurred while retrieving your settings. Try again later.');
                    done();
                });
        });

        it('Shows message when user\'s device is not registered', (done) => {                
            const selectedDevice = { id: 'ID does not exist', name: 'BlackBerry Bold'};
            setupCompWithDevices(devices, selectedDevice)
                .then(() => comp.refreshDevices())
                .then(() => {
                    testHeaderTextShown(`${selectedDevice.name} was not found. Select a device`);

                    expect(comp.selectedDevice).toBe(selectedDevice);
                    done();
                });
        });

        it('Shows message when user\'s device is not registered and there are no devices', (done) => {                
            const selectedDevice = { id: 'ID does not exist', name: 'BlackBerry Bold'};
            setupCompWithDevices([], selectedDevice)
                .then(() => comp.refreshDevices())
                .then(() => {
                    testHeaderTextShown(`${selectedDevice.name} was not found`);

                    expect(comp.selectedDevice).toBe(selectedDevice);
                    done();
                });
        });

        function testNoDevicesFound() {
            fixture.detectChanges();
            expect(comp.devices.length).toBe(0);
            expect(comp.selectedDevice).toBeUndefined();
            expect(comp.isLoading).toBeFalsy();
    
            let error = fixture.debugElement.query(By.css('.squid-options-header'));
            expect(error.nativeElement.textContent).toContain('No devices found');
        }
    });

    describe('ngOnInit()', () => {
        it('When user not signed into Chrome, redirects to SignedOutComponent', (done) => {
            mockIsSignedIntoChromeReturns(false);
            let routerSpy = spyOn(router, 'navigateByUrl').and.callFake(() => {});   

            comp.ngOnInit()
                .then(() => {
                    expect(routerSpy).toHaveBeenCalledWith(Route.signedOut);
                    done();
                })
                .catch(() => {
                    fail();
                    done();
                });
        });

        it('When user signed into Chrome, calls OptionsComponent.refreshDevices()', (done) => {
            mockIsSignedIntoChromeReturns(true);
            const compSpy = spyOn(comp, 'refreshDevices').and.callFake(() => {});

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

        it('When ChromeService.isSignedIntoChrome() throws, shows error', (done) => {
            spyOn(chromeService, 'isSignedIntoChrome').and.returnValue(Promise.reject('An error'));
            comp.ngOnInit()
            .then(() => {
                testErrorShown('Oops! An error occurred while retrieving your settings. Try again later.')
                done();
            })
        });
    });

    const devices: DeviceModel[] = [
        { id: "id1", name: "Nexus 5X" },
        { id: "id3", name: "Pixel" },
        { id: "id2", name: "Samsung Galaxy" },
    ];

    function mockIsSignedIntoChromeReturns(isSignedIn: boolean) {
        spyOn(chromeService, 'isSignedIntoChrome').and.returnValue(Promise.resolve(isSignedIn));
    }

    function mockGetDevicesReturns(devices: DeviceModel[]) {
        spyOn(deviceService, 'getDevices').and.returnValue(Promise.resolve(devices))
    }

    function mockGetSelectedDeviceReturns(device: DeviceModel) {
        spyOn(chromeStorageService, 'getSelectedDevice').and.returnValue(Promise.resolve(device));
    }

    function testErrorShown(expectedError: string) {
        fixture.detectChanges();
        let error = fixture.debugElement.query(By.css('.squid-error'));
        expect(error.nativeElement.textContent).toContain(expectedError);
    }

    function testHeaderTextShown(expectedText) {
        fixture.detectChanges();
        let header = fixture.debugElement.query(By.css('.squid-options-header'));
        expect(header.nativeElement.textContent).toContain(expectedText);
    }

    function setupCompWithDevices(devices: DeviceModel[], selectedDevice: DeviceModel): Promise<void> {
        mockIsSignedIntoChromeReturns(true);
        mockGetDevicesReturns(devices);
        mockGetSelectedDeviceReturns(selectedDevice);

        return comp.ngOnInit();
    }
});