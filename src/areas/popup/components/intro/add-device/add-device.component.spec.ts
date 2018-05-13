import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { SimpleNotificationsModule, NotificationsService } from 'angular2-notifications';

import { AddDeviceComponent } from './add-device.component';
import { DeviceService } from '../../../services/device.service';
import { DeviceType, DeviceModel } from '../../../../../contracts/squid';
import { GcmService } from '../../../services/gcm.service';
import { IntroBottomComponent } from '../intro-bottom/intro-bottom.component';
import { loadCss } from '../../testing/css-loader';
import { MockDeviceService } from '../../../services/testing/device.service.mock';
import { Route } from '../../../routing/route';
import { SettingsService } from '../../../services/settings.service';
import { ChromeDeviceModel } from '../../../services/squid-converter';
import { createDevice } from '../../../../../test/squid-helpers';
import { Strings } from '../../../../../assets/strings/strings';

describe('AddDeviceComponent', () => {
    const strings = new Strings();
    let deviceService: DeviceService;
    let gcmService: GcmService;
    let router: Router;
    let settingsService: SettingsService;
    let notificationService: NotificationsService;

    let comp: AddDeviceComponent;
    let fixture: ComponentFixture<AddDeviceComponent>;

    let device: ChromeDeviceModel;

    beforeAll(() => {
        loadCss();
    });

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ IntroBottomComponent, AddDeviceComponent ],
            imports: [ RouterTestingModule, SimpleNotificationsModule ],
            providers: [
                SettingsService,
                { provide: DeviceService, useValue: new MockDeviceService() },
                { provide: GcmService, useValue: new GcmService() },
                { provide: NotificationsService, useValue: new NotificationsService({})}
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
        notificationService = TestBed.get(NotificationsService);

        device = createDevice();
    })

    describe('addDevice()', () => {
        beforeEach(() => {
            spyOn(settingsService, 'setThisDevice').and.returnValue(Promise.resolve());
        });

        it('Base success case: Makes correct calls', (done) => {
            setupGetDevicesReturns([null, null]);
            setupMocks();

            comp.addDevice(device.name)
                .then(() => {
                    expect(gcmService.register).toHaveBeenCalledTimes(1);
                    expect(deviceService.addDevice).toHaveBeenCalledTimes(1);
                    expect(deviceService.addDevice).toHaveBeenCalledWith({ name: device.name, gcmToken: 'GCM token', deviceType: DeviceType.chrome});
                    expect(settingsService.setThisDevice).toHaveBeenCalledTimes(1);
                    expect(settingsService.setThisDevice).toHaveBeenCalledWith(device.id, 'GCM token');
                    expect(deviceService.getDevices).toHaveBeenCalledTimes(1);
                    expect(router.navigateByUrl).toHaveBeenCalledTimes(1);
                    expect(router.navigateByUrl).toHaveBeenCalledWith(Route.selectDevice);
                    done();
                })
        });

        it("Sends default device name if no name was provided", (done) => {
            setupMocks();
            comp.addDevice(null)
                .then(() => {
                        // "Chrome Browser" is the default device name
                        expect(deviceService.addDevice).toHaveBeenCalledWith({ name: 'Chrome Browser', gcmToken: 'GCM token', deviceType: DeviceType.chrome });
                        done();
                    })
        });

        it("Sends user-defined device name", (done) => {
            const deviceName = "Pixel 2";
            setupMocks();
            comp.addDevice(deviceName)
                .then(() => {
                        expect(deviceService.addDevice).toHaveBeenCalledWith({ name: deviceName, gcmToken: 'GCM token', deviceType: DeviceType.chrome });
                        done();
                    })
        });

        it("Sends gcm token", (done) => {
            const gcmToken = "This is the token";
            setupMocks(gcmToken);
            comp.addDevice(null)
                .then(() => {
                        // "Chrome Browser" is the default device name
                        expect(deviceService.addDevice).toHaveBeenCalledWith({ name: 'Chrome Browser', gcmToken: gcmToken, deviceType: DeviceType.chrome });
                        done();
                    })
        });

        it("Redirects to SelectDeviceComponent if user has other devices", (done) => {
            setupGetDevicesReturns([null, null]);
            setupMocks();
            comp.addDevice(null)
                .then(() => {
                        expect(router.navigateByUrl).toHaveBeenCalledWith(Route.selectDevice);
                        done();
                    });
        });

        it("Redirects to AddOtherDeviceComponent if user has no other devices", (done) => {
            setupGetDevicesReturns(undefined);
            setupMocks();
            comp.addDevice(null)
                .then(() => {
                        expect(router.navigate).toHaveBeenCalledWith([Route.addAnotherDevice], { queryParams: { returnUrl: Route.selectDevice } });
                        done();
                    });
        });

        it("Shows error on error", (done) => {
            spyOn(notificationService, 'error');
            spyOn(gcmService, 'register').and.returnValue(Promise.reject('Captain'))
            comp.addDevice(null)
                .then(() => {
                    expect(notificationService.error).toHaveBeenCalledWith(null, strings.addDevice.error);
                    done();
                });
        });
    });

    function setupGetDevicesReturns(devices: DeviceModel[]) {
        spyOn(deviceService, 'getDevices').and.returnValue(Promise.resolve(devices));
    }

    function setupMocks(gcmToken: string = "GCM token") {
        spyOn(gcmService, "register").and.returnValue(Promise.resolve(gcmToken));
        spyOn(deviceService, "addDevice").and.returnValue(Promise.resolve(device));
        spyOn(router, "navigateByUrl").and.returnValue(Promise.resolve());
        spyOn(router, 'navigate').and.returnValue(Promise.resolve());
    }
});