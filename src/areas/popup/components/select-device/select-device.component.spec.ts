import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { Observable } from 'rxjs/Observable';

import { ChromeService } from '../../services/chrome.service';
import { DeveloperComponent } from '../developer/developer.component';
import { DeviceModel, DeviceType, ErrorCode, ErrorModel } from '../../../../contracts/squid';
import { DeviceService } from '../../services/device.service';
import { loadCss } from '../testing/css-loader';
import { SelectDeviceComponent } from './select-device.component';
import { MockChromeService } from '../../services/testing/chrome.service.mock';
import { MockDeviceService } from '../../services/testing/device.service.mock';
import { RouterTestingModule } from '@angular/router/testing';
import { WindowService } from '../../services/window.service';
import { ChromeDeviceModel, ChromeErrorModel } from '../../services/squid-converter';
import { Route } from '../../routing/route';
import { ToolbarComponent } from '../toolbar/toolbar.component';
import { DeviceGridComponent } from '../common/device-grid/device-grid.component';
import { SettingsService } from '../../services/settings.service';
import { createDevice, createDevices } from '../../../../test/squid-helpers';
import { Strings } from '../../../../assets/strings/strings';

describe('SelectDeviceComponent', () => {
    let deviceService: DeviceService;
    let chromeService: ChromeService;
    let router: Router;
    let windowService: WindowService;
    let settingsService: SettingsService;
    let notificationService: NotificationsService

    let comp: SelectDeviceComponent;
    let fixture: ComponentFixture<SelectDeviceComponent>;

    let getSettings: jasmine.Spy;

    const strings = new Strings();

    beforeAll(() => {
        loadCss(['areas/popup/components/select-device/select-device.css',
                 'areas/popup/components/toolbar/toolbar.css']);
    });

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ DeviceGridComponent, SelectDeviceComponent, ToolbarComponent],
            imports: [ RouterTestingModule ],
            providers: [
                SettingsService,
                { provide: ChromeService, useValue: new MockChromeService() },
                { provide: DeviceService, useValue: new MockDeviceService() },
                { provide: WindowService, useValue: new WindowService() },
                { provide: NotificationsService, useValue: new NotificationsService({})}
            ]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SelectDeviceComponent);
        comp = fixture.debugElement.componentInstance;

        deviceService = TestBed.get(DeviceService);
        chromeService = TestBed.get(ChromeService);
        router = TestBed.get(Router);
        windowService = TestBed.get(WindowService);
        settingsService = TestBed.get(SettingsService);
        notificationService = TestBed.get(NotificationsService)
    })

    describe('constructor',() => {
        it('Has correct default values', function() {
            expect(comp.isLoading).toBeTruthy();
            expect(comp.error).toBeUndefined();
        });
    });

    describe('sendUrl()', () => {
        it('Sends a https:// URL to the device and then closes the window', (done) => {
            testSendUrl('https://www.example.com', done);
        });

        it('Sends a http:// URL to the device and then closes the window', (done) => {
            testSendUrl('https://www.example.com', done);
        });

        it('Shows notification if URL starts with chrome://', (done) => {
            spyOn(notificationService, 'warn');
            spyOn(windowService, 'close');
            spyOn(deviceService, 'sendUrl');
            spyOn(chromeService, 'getCurrentTabUrl').and.returnValue(Promise.resolve('chrome://'));

            const device = createDevice();
            comp.sendUrl(device)
                .then(() => {
                    expect(notificationService.warn).toHaveBeenCalledWith(null, strings.devices.error.pageCannotBeSent);

                    // Page is not sent, window is not closed
                    expect(deviceService.sendUrl).not.toHaveBeenCalled();
                    expect(windowService.close).not.toHaveBeenCalled();
                    done();
                });
        });

        it('Shows error on error', (done) => {
            spyOn(notificationService, 'error');
            spyOn(deviceService, 'sendUrl').and.returnValue(Promise.reject('You will be returned to your people, I promise.'));
            spyOn(chromeService, 'getCurrentTabUrl').and.returnValue(Promise.resolve('https://www.example.com'));

            const device = createDevice();
            comp.sendUrl(device)
                .then(() => {
                    expect(notificationService.error).toHaveBeenCalledWith(null, strings.devices.error.pageSendFailed);
                    done();
                });
        });

        function testSendUrl(url: string, done: Function): void {
            let sendUrl = spyOn(deviceService, 'sendUrl').and.returnValue(Promise.resolve());
            let getCurrentTabUrl = spyOn(chromeService, 'getCurrentTabUrl').and.returnValue(Promise.resolve(url));
            let windowClose = spyOn(windowService, 'close');

            const device = createDevice();
            comp.sendUrl(device)
                .then(() => {
                    expect(getCurrentTabUrl).toHaveBeenCalledTimes(1);
                    expect(sendUrl).toHaveBeenCalledWith(device.id, url);
                    expect(windowClose).toHaveBeenCalledTimes(1);
                    done();
                });
        }
    });

    describe('onLoad()', () => {
        it('Sets isLoading to true of devices is undefined', () => {
            comp.isLoading = false;
            comp.onLoad(undefined);
            expect(comp.isLoading).toBe(true);
        });

        it('Sets isLoading to true of devices is empty', () => {
            comp.isLoading = false;
            comp.onLoad([]);
            expect(comp.isLoading).toBe(true);
        });

        it('Sets isLoading to false of devices is non-empty', () => {
            comp.isLoading = true;
            comp.onLoad([null]);
            expect(comp.isLoading).toBe(false);
        });

        it('Template: Shows header text', () => {
            spyOn(deviceService, 'getDevicesCached').and.returnValue(Observable.of([createDevice()]));
            comp.onLoad([createDevice()]);
            fixture.detectChanges();
            let header = fixture.debugElement.query(By.css('.header'));
            expect(header.nativeElement.textContent).toContain(comp.strings.devices.selectDevice);
        });
    });

    describe('onError()', () => {
        it('Redirects to intro if user not signed in', () => {
            testRedirectToIntro(new ChromeErrorModel(ErrorCode.NotSignedIn, ''));
        });

        it('Redirects to intro if user not found',  () => {
            testRedirectToIntro(new ChromeErrorModel(ErrorCode.UserNotFound, ''));
        });

        function testRedirectToIntro(error?: ErrorModel): void {
            let routerNavigateByUrl = spyOn(router, 'navigateByUrl');

            comp.onError(error)
            expect(routerNavigateByUrl).toHaveBeenCalledWith(Route.intro.base);
        }
    });

    describe('ngOnInit()', () => {
        it('Redirects to intro if settings.thisDevice is undefined', (done) => {
            testRedirection(undefined, createDevices(), Route.intro.base, done);
        });

        it('Redirects to intro if devices is undefined', (done) => {
            testRedirection('device ID', undefined, Route.intro.base, done);
        });

        it('Redirects to add another device if settings.thisDevice is the only one registered', (done) => {
            const device = createDevice();
            testRedirection(device.id, [device], Route.addAnotherDevice, done);
        });

        it('Redirects to intro if settings.thisDevice is not registered with the service', (done) => {
            testRedirection('device ID not registered', createDevices(), Route.intro.base, done);
        });

        it('Does nothing if this device and others are registered with the service', (done) => {
            const devices = createDevices();
            callNgOnInit(devices[0].id, devices).then(() => {
                expect(router.navigateByUrl).not.toHaveBeenCalled();
                done();
            });
        });

        function testRedirection(thisDeviceId: string, devices: ChromeDeviceModel[], expectedRoute: string, done: Function) {
            callNgOnInit(thisDeviceId, devices).then(() => {
                expect(router.navigateByUrl).toHaveBeenCalledWith(expectedRoute);
                expect(router.navigateByUrl).toHaveBeenCalledTimes(1);
                done();
            });
        }

        function callNgOnInit(thisDeviceId: string, devices: ChromeDeviceModel[]) {
            if(thisDeviceId) {
                settingsService.settings.thisDevice = {
                    id: thisDeviceId,
                    gcmToken: 'bar'
                };
            }
            spyOn(router, 'navigateByUrl');
            spyOn(deviceService, 'getDevices').and.returnValue(Promise.resolve(devices));

            return comp.ngOnInit();
        }
    });
});