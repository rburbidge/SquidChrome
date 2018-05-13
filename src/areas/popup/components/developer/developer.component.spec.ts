import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { ChromeService } from '../../services/chrome.service';
import { DeveloperComponent } from '../developer/developer.component';
import { DeviceService } from '../../services/device.service';
import { loadCss } from '../testing/css-loader';
import { MockChromeService } from '../../services/testing/chrome.service.mock';
import { MockDeviceService } from '../../services/testing/device.service.mock';
import { Route } from '../../routing/route';
import { SettingsService } from '../../services/settings.service';
import { ToolbarComponent } from '../toolbar/toolbar.component';
import { WindowService } from '../../services/window.service';

describe('DeveloperComponent', () => {
    let deviceService: DeviceService;
    let router: Router;
    let settingsService: SettingsService;
    let windowService: WindowService;

    let comp: DeveloperComponent;
    let fixture: ComponentFixture<DeveloperComponent>;

    beforeAll(() => {
        loadCss();
    });

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ DeveloperComponent, ToolbarComponent ],
            imports: [ RouterTestingModule ],
            providers: [
                { provide: ChromeService, useValue: new MockChromeService() },
                { provide: DeviceService, useValue: new MockDeviceService() },
                { provide: SettingsService, useValue: new SettingsService() },
                { provide: WindowService, useValue: new WindowService() },
            ]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DeveloperComponent);
        comp = fixture.debugElement.componentInstance;

        deviceService = TestBed.get(DeviceService);
        router = TestBed.get(Router);
        settingsService = TestBed.get(SettingsService);
        windowService = TestBed.get(WindowService);
    });

    describe('addDevice()', () => {
        it('Adds a fake device', (done) => {
            spyOn(deviceService, "addDevice").and.returnValue(Promise.resolve());
            spyOn(router, 'navigateByUrl');
            comp.addDevice()
                .then(() => {
                    expect(deviceService.addDevice).toHaveBeenCalledTimes(1);
                    expect(router.navigateByUrl).toHaveBeenCalledWith(Route.selectDevice);
                    done();
                })
        });
    });

    describe('resetApp()', () => {
        it('Resets the app settings', (done) => {
            spyOn(settingsService, "reset").and.returnValue(Promise.resolve());
            spyOn(windowService, 'close');
            comp.resetApp()
                .then(() => {
                    expect(settingsService.reset).toHaveBeenCalledTimes(1);
                    expect(windowService.close).toHaveBeenCalledTimes(1);
                    done();
                });
            });
    });
});