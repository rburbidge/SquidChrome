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
    })

    describe('constructor',() => {
        it('Has correct default values', function() {
            expect(comp.isLoading).toBeTruthy();
            expect(comp.error).toBeUndefined();
            expect(comp.devices.length).toBe(0);
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

        function testIcon(deviceType: DeviceType, expected: string): void {
            const device = createDevice();
            device.deviceType = deviceType;
            expect(comp.getDeviceIcon(device)).toBe(expected);
        }
    });

    describe('removeDevice()', () => {
        it('Removes a device', (done) => {
            spyOn(window, "confirm").and.returnValue(true);
            spyOn(deviceService, 'removeDevice').and.returnValue(Promise.resolve());
            const removedDevice = devices[1];

            fixture.detectChanges();

            setupCompWithDevices(devices)
                .then(() => comp.removeDevice(new Event('fake event'), removedDevice))
                .then(() => {
                    expect(comp.devices.find(d => d.id == removedDevice.id)).toBeUndefined('Devices still contained the deleted device');
                    testHeaderTextShown(`${removedDevice.name} has been deleted`);
                    done();
                });
        });

        it('Shows an error if the device could not be removed', (done) => {
            spyOn(window, "confirm").and.returnValue(true);
            spyOn(deviceService, 'removeDevice').and.returnValue(Promise.reject('An error'));
            const windowAlertSpy = spyOn(window, 'alert').and.returnValue(undefined);
            const removedDevice = devices[0];

            setupCompWithDevices(devices)
                .then(() => comp.removeDevice(new Event('fake event'), removedDevice))
                .then(() => {
                    expect(windowAlertSpy).toHaveBeenCalledWith('An error occurred while removing the device. Please try again later.');
                    done();
                });
        });

        it('Does not remove device when user denies removal', (done) => {
            spyOn(window, "confirm").and.returnValue(false);
            let removeDeviceSpy = spyOn(deviceService, 'removeDevice').and.returnValue(Promise.reject('An error'));

            setupCompWithDevices(devices)
                .then(() => comp.removeDevice(new Event('fake event'), devices[0]))
                .then(() => {
                    fixture.detectChanges();
                    expect(removeDeviceSpy).toHaveBeenCalledTimes(0);
                    done();
                });
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

        it('Shows message when the user has no devices', (done) => {
            mockGetDevicesReturns([]);
            fixture.detectChanges();
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
            fixture.detectChanges();
            comp.refreshDevices()
                .then(() => {
                    testNoDevicesFound();
                    done();
                });
        });
    
        it('Shows error if loading fails', (done) => {
            spyOn(deviceService, 'getDevices').and.returnValue(Promise.reject('An error'))
            fixture.detectChanges();
            comp.refreshDevices()
                .then(() => {
                    testErrorShown('Oops! An error occurred while retrieving your settings. Try again later.');
                    done();
                }).catch(e => {
                    console.log(e);
                });
        });

        function testNoDevicesFound() {
            fixture.detectChanges();
            expect(comp.devices.length).toBe(0);
            expect(comp.isLoading).toBeFalsy('comp.isLoading');
    
            let error = fixture.debugElement.query(By.css('.squid-options-header'));
            expect(error.nativeElement.textContent).toContain('No devices found');
        }
    });

    describe('ngOnInit()', () => {
        
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

    function mockGetDevicesReturns(devices: DeviceModel[]) {
        spyOn(deviceService, 'getDevices').and.returnValue(Promise.resolve(devices))
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