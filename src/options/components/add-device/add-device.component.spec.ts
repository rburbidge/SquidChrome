import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { AddDeviceComponent } from './add-device.component';
import { DeviceService } from '../../services/device.service';
import { GcmService } from '../../services/gcm.service';
import { loadCss } from '../testing/css-loader';
import { MockDeviceService } from '../../services/testing/device.service.mock';
import { Route } from '../../route';
import { RouterTestingModule } from '@angular/router/testing';
import { SettingsService } from '../../services/settings.service';

describe('AddDeviceComponent', () => {
    let deviceService: DeviceService;
    let gcmService: GcmService;
    let router: Router;
    let settingsService: SettingsService;

    let comp: AddDeviceComponent;
    let fixture: ComponentFixture<AddDeviceComponent>;

    beforeAll(() => {
        loadCss();
    });

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ AddDeviceComponent ],
            imports: [ RouterTestingModule ],
            providers: [
                { provide: DeviceService, useValue: new MockDeviceService() },
                { provide: GcmService, useValue: new GcmService() },
                { provide: SettingsService, useValue: new SettingsService() }
            ]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AddDeviceComponent);
        comp = fixture.debugElement.componentInstance;

        deviceService = TestBed.get(DeviceService);
        gcmService = TestBed.get(GcmService);
        settingsService = TestBed.get(SettingsService);
        router = TestBed.get(Router);
    })

    describe('addDevice()', () => {
        it('Base success case: Makes correct calls', (done) => {
            const gcmToken = "GCM token";
            const gcmRegisterSpy = spyOn(gcmService, "register").and.returnValue(Promise.resolve(gcmToken));
            const addDeviceSpy = spyOn(deviceService, "addDevice").and.returnValue(Promise.resolve());
            const navigateSpy = spyOn(router, "navigateByUrl").and.returnValue(true);
            const setInitalizedSpy = spyOn(settingsService, "setInitialized").and.returnValue(Promise.resolve());
            comp.addDevice(null)
                .then(device => {
                    expect(gcmRegisterSpy).toHaveBeenCalledTimes(1);
                    expect(addDeviceSpy).toHaveBeenCalledTimes(1);
                    expect(addDeviceSpy).toHaveBeenCalledWith("Chrome Browser", "GCM token");
                    expect(setInitalizedSpy).toHaveBeenCalledTimes(1);
                    expect(navigateSpy).toHaveBeenCalledTimes(1);
                    expect(navigateSpy).toHaveBeenCalledWith(Route.options);
                    done();
                })
        });

        it("Uses default 'Chrome Browser' device name if no name is provided", (done) => {
            const gcmToken = "GCM token";
            const gcmRegisterSpy = setupGcmRegisterReturns(gcmToken);
            const addDeviceSpy = setupAddDeviceSpy();
            const navigateSpy = setupNavigateSpy();
            const setInitalizedSpy = setupInitializedSpy();
            comp.addDevice(null)
                .then(device => {
                    // "Chrome Browser" is the default device name
                    expect(addDeviceSpy).toHaveBeenCalledWith("Chrome Browser", gcmToken);
                    done();
                })
        });

        it("Uses user-input name if it is provided", (done) => {
            const gcmToken = "GCM token";
            const gcmRegisterSpy = setupGcmRegisterReturns(gcmToken);
            const addDeviceSpy = setupAddDeviceSpy();
            const navigateSpy = setupNavigateSpy();
            const setInitalizedSpy = setupInitializedSpy();
            const deviceName = "Pixel 2";
            comp.addDevice(deviceName)
                .then(device => {
                    expect(addDeviceSpy).toHaveBeenCalledWith(deviceName, gcmToken);
                    done();
                })
        });
    });

    function setupGcmRegisterReturns(gcmToken: string): jasmine.Spy {
        return spyOn(gcmService, "register").and.returnValue(Promise.resolve(gcmToken));
    }

    function setupAddDeviceSpy(): jasmine.Spy {
        return spyOn(deviceService, "addDevice").and.returnValue(Promise.resolve());
    }

    function setupNavigateSpy(): jasmine.Spy {
        return spyOn(router, "navigateByUrl").and.returnValue(Promise.resolve());
    }

    function setupInitializedSpy(): jasmine.Spy {
        return spyOn(settingsService, "setInitialized").and.returnValue(Promise.resolve());
    }
});