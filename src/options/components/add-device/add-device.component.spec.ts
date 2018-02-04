import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { AddDeviceComponent } from './add-device.component';
import { DeviceService } from '../../services/device.service';
import { DeviceType } from '../../../contracts/squid';
import { GcmService } from '../../services/gcm.service';
import { loadCss } from '../testing/css-loader';
import { MockDeviceService } from '../../services/testing/device.service.mock';
import { Route } from '../../routing/route';
import { RouterTestingModule } from '@angular/router/testing';
import { SettingsService } from '../../services/settings.service';

describe('AddDeviceComponent', () => {
    let deviceService: DeviceService;
    let gcmService: GcmService;
    let router: Router;
    let settingsService: SettingsService;

    let comp: AddDeviceComponent;
    let fixture: ComponentFixture<AddDeviceComponent>;

    let gcmRegisterSpy: jasmine.Spy;
    let addDeviceSpy: jasmine.Spy;
    let navigateSpy: jasmine.Spy;
    let setInitalizedSpy: jasmine.Spy;

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
            setupMocks();
            comp.addDevice(null)
                .then(device => {
                    expect(gcmRegisterSpy).toHaveBeenCalledTimes(1);
                    expect(addDeviceSpy).toHaveBeenCalledTimes(1);
                    expect(addDeviceSpy).toHaveBeenCalledWith({ name: 'Chrome Browser', gcmToken: 'GCM token', deviceType: DeviceType.chrome});
                    expect(setInitalizedSpy).toHaveBeenCalledTimes(1);
                    expect(navigateSpy).toHaveBeenCalledTimes(1);
                    expect(navigateSpy).toHaveBeenCalledWith(Route.options);
                    done();
                })
        });

        it("Sends default device name if no name was provided", (done) => {
            setupMocks();
            comp.addDevice(null)
                .then(device => {
                    // "Chrome Browser" is the default device name
                    expect(addDeviceSpy).toHaveBeenCalledWith({ name: 'Chrome Browser', gcmToken: 'GCM token', deviceType: DeviceType.chrome});
                    done();
                })
        });

        it("Sends user-defined device name", (done) => {
            const deviceName = "Pixel 2";
            setupMocks();
            comp.addDevice(deviceName)
                .then(device => {
                    expect(addDeviceSpy).toHaveBeenCalledWith({ name: deviceName, gcmToken: 'GCM token', deviceType: DeviceType.chrome});
                    done();
                })
        });

        it("Sends gcm token", (done) => {
            const gcmToken = "This is the token";
            setupMocks(gcmToken);
            comp.addDevice(null)
                .then(device => {
                    // "Chrome Browser" is the default device name
                    expect(addDeviceSpy).toHaveBeenCalledWith({ name: 'Chrome Browser', gcmToken: gcmToken, deviceType: DeviceType.chrome});
                    done();
                })
        });
    });

    function setupMocks(gcmToken: string = "GCM token") {
        gcmRegisterSpy = spyOn(gcmService, "register").and.returnValue(Promise.resolve(gcmToken));
        addDeviceSpy = spyOn(deviceService, "addDevice").and.returnValue(Promise.resolve());
        navigateSpy = spyOn(router, "navigateByUrl").and.returnValue(Promise.resolve());
        setInitalizedSpy = spyOn(settingsService, "setInitialized").and.returnValue(Promise.resolve());
    }
});