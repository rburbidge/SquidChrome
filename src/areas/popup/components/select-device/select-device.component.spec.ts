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
import { WindowService } from '../../services/window.service';
import { ChromeDeviceModel, ChromeErrorModel } from '../../services/squid-converter';
import { Route } from '../../routing/route';
import { ToolbarComponent } from '../toolbar/toolbar.component';
import { DeviceGridComponent } from '../common/device-grid/device-grid.component';

describe('SelectDeviceComponent', () => {
    let deviceService: DeviceService;
    let chromeService: ChromeService;
    let router: Router;
    let windowService: WindowService;

    let comp: SelectDeviceComponent;
    let fixture: ComponentFixture<SelectDeviceComponent>;

    let getSettings: jasmine.Spy;

    beforeAll(() => {
        loadCss(['areas/popup/components/select-device/select-device.css',
                 'areas/popup/components/toolbar/toolbar.css']);
    });

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ DeviceGridComponent, SelectDeviceComponent, ToolbarComponent],
            imports: [ RouterTestingModule ],
            providers: [
                { provide: ChromeService, useValue: new MockChromeService() },
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
        router = TestBed.get(Router);
        windowService = TestBed.get(WindowService);
    })

    describe('constructor',() => {
        it('Has correct default values', function() {
            expect(comp.isLoading).toBeTruthy();
            expect(comp.error).toBeUndefined();
        });
    });

    describe('sendUrl()', () => {
        it('Sends a URL to the device and then closes the window', (done) => {
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

    describe('onLoad()', () => {
        beforeEach(() => {
            spyOn(router, 'navigateByUrl');
        })

        it('Sets isLoading to false', () => {
            expect(comp.isLoading).toBeTruthy();
            comp.onLoad(undefined);
            expect(comp.isLoading).toBeFalsy();
        });

        it('Redirects to intro if devices is undefined', () => {
            comp.onLoad(undefined);
            expect(router.navigateByUrl).toHaveBeenCalledWith(Route.intro.base);
        });

        it('Redirects to intro if devices is empty', () => {
            comp.onLoad([]);
            expect(router.navigateByUrl).toHaveBeenCalledWith(Route.intro.base);
        });

        it('Does not navigate to intro if devices.length > 1', () => {
            comp.onLoad([null]);
            expect(router.navigateByUrl).not.toHaveBeenCalled();
        });

        it('Shows header text', () => {
            comp.onLoad([null]);
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

    function createDevice(): ChromeDeviceModel {
        return {
            id: "id1",
            name: "Nexus 5X",
            deviceType: DeviceType.android,
            getIcon: () => 'Icon'
        };
    }

    function mockIsSignedIntoChromeReturns(isSignedIn: boolean): jasmine.Spy {
        return spyOn(chromeService, 'isSignedIntoChrome').and.returnValue(Promise.resolve(isSignedIn));
    }
});