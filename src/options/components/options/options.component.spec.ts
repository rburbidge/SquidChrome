import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { Router } from '@angular/router';

import { ChromeService } from '../../services/chrome.service';
import { DeveloperComponent } from '../developer/developer.component';
import { DeviceModel, DeviceType, ErrorCode, ErrorModel } from '../../../contracts/squid';
import { DeviceService } from '../../services/device.service';
import { loadCss } from '../testing/css-loader';
import { OptionsComponent } from './options.component';
import { MockChromeService } from '../../services/testing/chrome.service.mock';
import { MockDeviceService } from '../../services/testing/device.service.mock';
import { Route } from '../../route';
import { RouterTestingModule } from '@angular/router/testing';
import { Settings, SettingsService } from '../../services/settings.service';
import { WindowService } from '../../services/window.service';

describe('OptionsComponent', () => {
    let deviceService: DeviceService;
    let chromeService: ChromeService;
    let settingsService: SettingsService;
    let router: Router;

    let comp: OptionsComponent;
    let fixture: ComponentFixture<OptionsComponent>;

    let settings: Settings;

    beforeAll(() => {
        loadCss();
    });

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ DeveloperComponent, OptionsComponent ],
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
        fixture = TestBed.createComponent(OptionsComponent);
        comp = fixture.debugElement.componentInstance;

        deviceService = TestBed.get(DeviceService);
        chromeService = TestBed.get(ChromeService);
        settingsService = TestBed.get(SettingsService);
        router = TestBed.get(Router);

        // Set default settings. If a test needs to override, it can set the values directly on the settings object
        settings = SettingsService.createDefault();
        settings.initialized = true;
        mockGetSettingsReturns(settings);
    })

    describe('constructor',() => {
        it('Has correct default values', function() {
            expect(comp.isLoading).toBeTruthy();
            expect(comp.error).toBeUndefined();
            expect(comp.devices.length).toBe(0);
            expect(comp.selectedDevice).toBeNull();
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

    describe('getDeviceIcon()', () => {
        it('Returns icon for Android device', () => {
            testIcon(DeviceType.android, 'phone_android');
        });

        it('Returns icon for Chrome device', () => {
            testIcon(DeviceType.chrome, 'laptop');
        });

        it('Returns Android icon for other device types', () => {
            testIcon(undefined, 'phone_android');
        });

        function testIcon(deviceType: string, expected: string): void {
            const device = createDevice();
            device.deviceType = deviceType;
            expect(comp.getDeviceIcon(device)).toBe(expected);
        }
    });

    describe('setDevice()', () => {
        it('Sets the selected device', (done) => {
            const setSelectedDeviceSpy = spyOn(settingsService, 'setSelectedDevice').and.returnValue(Promise.resolve());
            
            setupCompWithDevices(devices, undefined)
                .then(() => comp.setDevice(devices[0]))
                .then(() => {
                    testHeaderTextShown(`Pages will be sent to ${devices[0].name}`);

                    expect(comp.selectedDevice).toBe(devices[0]);
                    expect(setSelectedDeviceSpy).toHaveBeenCalledWith(devices[0]);
                    done();
                });
        });

        it('Does nothing if the device was already set', (done) => {
            const setSelectedDeviceSpy = spyOn(settingsService, 'setSelectedDevice').and.returnValue(Promise.resolve());
            const selectedDevice = devices[1];

            setupCompWithDevices(devices, selectedDevice)
                .then(() => comp.setDevice(selectedDevice))
                .then(() => {
                    expect(setSelectedDeviceSpy).toHaveBeenCalledTimes(0);
                    done();
                });
        });
    });

    describe('isDeviceSelected()', () => {
        it('Returns false when there is no selected device', function() {
            expect(comp.isDeviceSelected(null)).toBeFalsy();
            expect(comp.isDeviceSelected({ id: "id", name: "name", deviceType: DeviceType.android})).toBeFalsy();
        });
    
        it('Returns true when a device is selected and they share the same ID', function() {
            let device1 = { id: "id1", name: "doesn't matter", deviceType: DeviceType.android };
            let device2 = { id: "id2", name: "also doesn't matter", deviceType: DeviceType.android };
            comp.selectedDevice = device1;
            expect(comp.isDeviceSelected(device2)).toBeFalsy();
            expect(comp.isDeviceSelected(device1)).toBeTruthy();
        });
    });

    describe('removeDevice()', () => {
        it('Removes a device', (done) => {
            spyOn(window, "confirm").and.returnValue(true);
            spyOn(deviceService, 'removeDevice').and.returnValue(Promise.resolve());
            const removedDevice = devices[1];

            setupCompWithDevices(devices, undefined)
                .then(() => comp.removeDevice(new Event('fake event'), removedDevice))
                .then(() => {
                    expect(comp.devices.find(d => d.id == removedDevice.id)).toBeUndefined('Devices still contained the deleted device');
                    testHeaderTextShown(`${removedDevice.name} has been deleted`);
                    done();
                });
        });

        it('Removes device that is selected', (done) => {
            spyOn(window, "confirm").and.returnValue(true);
            const setSelectedDeviceSpy = spyOn(settingsService, 'setSelectedDevice').and.returnValue(Promise.resolve());
            const removeDeviceSpy = spyOn(deviceService, 'removeDevice').and.returnValue(Promise.resolve());
            const selectedDevice = { ...devices[2] }; // Copy the device because it's going to be deleted

            setupCompWithDevices(devices, selectedDevice)
                .then(() => comp.removeDevice(new Event('fake event'), selectedDevice))
                .then(() => {
                    expect(removeDeviceSpy).toHaveBeenCalledWith(selectedDevice.id);
                    expect(setSelectedDeviceSpy).toHaveBeenCalledWith(null);

                    expect(comp.devices.find(d => d.id == selectedDevice.id)).toBeUndefined('Devices still contained the deleted device');
                    expect(comp.selectedDevice).toBeUndefined('Devices still contained the deleted device');

                    testHeaderTextShown(`${selectedDevice.name} has been deleted`);
                    done();
                });
        });

        it('Shows an error if the device could not be removed', (done) => {
            spyOn(window, "confirm").and.returnValue(true);
            spyOn(deviceService, 'removeDevice').and.returnValue(Promise.reject('An error'));
            const windowAlertSpy = spyOn(window, 'alert').and.returnValue(undefined);
            const removedDevice = devices[0];

            setupCompWithDevices(devices, undefined)
                .then(() => comp.removeDevice(new Event('fake event'), removedDevice))
                .then(() => {
                    expect(windowAlertSpy).toHaveBeenCalledWith('An error occurred while removing the device. Please try again later.');
                    done();
                });
        });

        it('Does not remove device when user denies removal', (done) => {
            spyOn(window, "confirm").and.returnValue(false);
            let removeDeviceSpy = spyOn(deviceService, 'removeDevice').and.returnValue(Promise.reject('An error'));

            setupCompWithDevices(devices, undefined)
                .then(() => comp.removeDevice(new Event('fake event'), devices[0]))
                .then(() => {
                    fixture.detectChanges();
                    expect(removeDeviceSpy).toHaveBeenCalledTimes(0);
                    done();
                });
        });
    });

    describe('refreshDevices()', () => {
        it('Shows devices and selected device on success', (done) => {
            mockGetDevicesReturns(devices);
            settings.device = devices[1];
            
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
            spyOn(comp, 'ngOnInit').and.returnValue(Promise.resolve()); // Fake ngOnInit() to prevent it from interfering with refreshDevices() results

            comp.isLoading = false; // 1. Begin with loading = false and an error
            comp.error = 'Some random error';
            
            comp.refreshDevices()
                .then(() => {
                    fixture.detectChanges();
                    expect(comp.isLoading).toBeFalsy(); // 3. Expect loading = false once complete
                    expect(comp.error).toBeUndefined();
                    expect(comp.devices).toEqual(devices);
                    expect(comp.selectedDevice).toBeNull();
                    done();
                });
            expect(comp.isLoading).toBeTruthy(); // 2. Expect loading = true and that the error was cleared
            expect(comp.error).toBeUndefined();
        });

        it('Shows message when the user has no devices', (done) => {
            mockGetDevicesReturns([]);
    
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
    
            comp.refreshDevices()
                .then(() => {
                    testNoDevicesFound();
                    done();
                });
        });
    
        it('Shows error if loading fails', (done) => {
            spyOn(deviceService, 'getDevices').and.returnValue(Promise.reject('An error'))
    
            comp.refreshDevices()
                .then(() => {
                    testErrorShown('Oops! An error occurred while retrieving your settings. Try again later.');
                    done();
                });
        });

        it('Shows message when user\'s device is not registered', (done) => {                
            const selectedDevice = { id: 'ID does not exist', name: 'Samsung Galaxy', deviceType: DeviceType.android};
            setupCompWithDevices(devices, selectedDevice)
                .then(() => comp.refreshDevices())
                .then(() => {
                    testHeaderTextShown(`${selectedDevice.name} was not found. Select a device`);

                    expect(comp.selectedDevice).toBe(selectedDevice);
                    done();
                });
        });

        it('Shows message when user\'s device is not registered and there are no devices', (done) => {                
            const selectedDevice = { id: 'ID does not exist', name: 'Samsung Galaxy', deviceType: DeviceType.android};
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
            expect(comp.selectedDevice).toBeNull();
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
        { id: "id1", name: "Nexus 5X", deviceType: DeviceType.android},
        { id: "id3", name: "Pixel", deviceType: DeviceType.android},
        { id: "id2", name: "Samsung Galaxy", deviceType: DeviceType.android},
    ];

    function createDevice(): DeviceModel {
        return {
            id: "id1",
            name: "Nexus 5X",
            deviceType: DeviceType.android
        };
    }

    function mockIsSignedIntoChromeReturns(isSignedIn: boolean) {
        spyOn(chromeService, 'isSignedIntoChrome').and.returnValue(Promise.resolve(isSignedIn));
    }

    function mockGetDevicesReturns(devices: DeviceModel[]) {
        spyOn(deviceService, 'getDevices').and.returnValue(Promise.resolve(devices))
    }

    function mockGetSettingsReturns(settings: Settings) {
        spyOn(settingsService, 'getSettings').and.returnValue(Promise.resolve(settings));
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
        
        settings.device = selectedDevice;

        return comp.ngOnInit();
    }
});