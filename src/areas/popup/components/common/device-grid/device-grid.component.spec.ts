import { async, ComponentFixture, TestBed, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { NotificationsService } from 'angular2-notifications';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';

import { DeveloperComponent } from '../../developer/developer.component';
import { DeviceModel } from '../../../../../contracts/squid';
import { DeviceService } from '../../../services/device.service';
import { loadCss } from '../../testing/css-loader';
import { DeviceGridComponent } from './device-grid.component';
import { MockDeviceService } from '../../../services/testing/device.service.mock';
import { SettingsService } from '../../../services/settings.service';
import { ChromeDeviceModel } from '../../../services/squid-converter';
import { ToolbarComponent } from '../../toolbar/toolbar.component';
import { createDevices, createDevice } from '../../../../../test/squid-helpers';
import { Strings } from '../../../../../assets/strings/strings';

describe('DeviceGridComponent', () => {
    const strings = new Strings();
    let deviceService: DeviceService;
    let settingsService: SettingsService;
    let notificationsService: NotificationsService;
    
    let devices: ChromeDeviceModel[];

    let comp: DeviceGridComponent;
    let fixture: ComponentFixture<DeviceGridComponent>;

    beforeAll(() => {
        loadCss(['areas/popup/components/common/device-grid/device-grid.css',
                 'areas/popup/components/toolbar/toolbar.css']);
    });

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ DeveloperComponent, DeviceGridComponent, ToolbarComponent],
            imports: [ RouterTestingModule ],
            providers: [
                SettingsService,
                { provide: ComponentFixtureAutoDetect, useValue: true },
                { provide: DeviceService, useValue: new MockDeviceService() },
                { provide: NotificationsService, useValue: new NotificationsService({})}
            ]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DeviceGridComponent);
        comp = fixture.debugElement.componentInstance;

        deviceService = TestBed.get(DeviceService);
        settingsService = TestBed.get(SettingsService);
        notificationsService = TestBed.get(NotificationsService);

        devices = createDevices();
    })

    describe('constructor',() => {
        it('Has correct default values', function() {
            let comp = new DeviceGridComponent(null, null, null);
            expect(comp.isLoading).toBeTruthy();
            expect(comp.devices).toBeUndefined();
            expect(comp.showAddDevice).toBe(false);
        });
    });

    describe('refreshDevices()', () => {
        it('Template: Shows devices on success', (done) => {
            mockGetDevicesReturns(devices);            

            comp.isLoading = false;

            comp.onLoad.asObservable()
                .subscribe(() => {
                    expect(comp.devices).toEqual(devices);
                    expect(comp.isLoading).toBeFalsy();

                    fixture.detectChanges();
                    const devicesElements = fixture.debugElement.queryAll(By.css('.device'));
                    expect(devicesElements.length).toBe(devices.length);

                    done();
                });
            comp.refreshDevices();
        });

        it('Shows error on error', (done) => {
            spyOn(deviceService, 'getDevicesCached').and.returnValue(Observable.throw("Meesa lika dis"));
            spyOn(notificationsService, 'error');

            comp.isLoading = false;
            comp.onError.asObservable()
                .subscribe(() => {
                        expect(comp.isLoading).toBeFalsy();
                        expect(notificationsService.error).toHaveBeenCalledWith(null, strings.devices.error.refreshFailed);
                        done();
                    });
            comp.refreshDevices();
        });
    
        it('Emits onLoad when loading is complete', (done) => {
            mockGetDevicesReturns(devices);

            comp.onLoad.asObservable()
                .subscribe(calledDevices => {
                    expect(calledDevices).toBe(devices);
                    done();
                });
            comp.refreshDevices();
        });

        it('Emits onError if loading fails', (done) => {
            const error = "No, I am your father.";
            spyOn(deviceService, 'getDevicesCached').and.returnValue(Observable.throw(error));

            comp.onError.asObservable()
                .subscribe(actualError => {
                    expect(actualError).toBe(error as any);
                    done();
                });
            comp.refreshDevices();
        });

        it('isLoading=true when there are no devices to show', (done) => {
            mockGetDevicesReturns(undefined);            

            comp.onLoad.asObservable()
                .subscribe(() => {
                    expect(comp.isLoading).toBe(true);
                    done();
                });
            comp.refreshDevices();
        });

        it('isLoading=true when there are no devices to show because they were filtered out', (done) => {
            const device = createDevice();
            settingsService.settings.thisDevice = {
                id: device.id,
                gcmToken: 'foo'
            };

            mockGetDevicesReturns([device]);
            comp.showThisDevice = false;
            comp.onLoad.asObservable()
                .subscribe(() => {
                    expect(comp.isLoading).toBe(true);
                    done();
                });
            comp.refreshDevices();
        });

        it('Sorts the devices', (done) => {
            mockGetDevicesReturns(createDevices());

            comp.onLoad.asObservable()
                .subscribe(() => {
                    // Verify that a new unsorted set of the devices does not equal the component's
                    const devices = createDevices();
                    expect(comp.devices).not.toEqual(devices);

                    // Verify that the component's devices are sorted
                    const expectedDevices = devices.slice();
                    ChromeDeviceModel.sort(expectedDevices);
                    expect(comp.devices).toEqual(expectedDevices);
                    done();
                });
            comp.refreshDevices();
        });
    });

    describe('showThisDevice', () => {
        it('If showThisDevice=false, do nothing when thisDevice is unset', (done) => {
            const devices = createDevices();
            testShowThisDevice(false, devices, devices, done);
        });

        it('If showThisDevice=false, do not show thisDevice', (done) => {
            const devices = createDevices();
            settingsService.settings.thisDevice = {
                id: devices[2].id,
                gcmToken: 'n/a'
            };
            const expectedDevices = devices.slice();
            expectedDevices.splice(2, 1);
            ChromeDeviceModel.sort(expectedDevices);
            testShowThisDevice(false, devices, expectedDevices, done);
        });

        it('If showThisDevice=true, then show this device', (done) => {
            const devices = createDevices();
            settingsService.settings.thisDevice = {
                id: devices[2].id,
                gcmToken: 'n/a'
            };
            testShowThisDevice(true, devices, devices, done);
        });

        function testShowThisDevice(showThisDevice: boolean, devices: ChromeDeviceModel[], expectedDevices: ChromeDeviceModel[], done: Function) {
            spyOn(deviceService, 'getDevicesCached').and.returnValue(Observable.of(devices));
            comp.showThisDevice = showThisDevice;
            
            comp.onLoad.asObservable()
                .subscribe(() => {
                    expect(comp.devices).toEqual(expectedDevices);
                    done();
                });
            comp.refreshDevices();
        }
    });

    describe('showFillerDevice()', () => {
        it('Returns false with even number of devices', () => {
            testShowFillerItem([], false, false);
        });

        it('Returns true with odd number of devices', () => {
            testShowFillerItem([null], false, true);
        });

        it('Returns true with even number of devices and add device item', () => {
            testShowFillerItem([], true, true);
        });

        it('Returns false with odd number of devices and add device item', () => {
            testShowFillerItem([null], true, false);
        });

        function testShowFillerItem(devices: ChromeDeviceModel[], showAddDevice: boolean, expected: boolean) {
            comp.devices = devices;
            comp.showAddDevice = showAddDevice;
            expect(comp.showFillerDevice()).toBe(expected);
        }
    });

    function mockGetDevicesReturns(devices: DeviceModel[]): jasmine.Spy {
        return spyOn(deviceService, 'getDevicesCached').and.returnValue(Observable.of(devices));
    }

});