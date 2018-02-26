import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChromeService } from '../../services/chrome.service';
import { DeveloperComponent } from '../developer/developer.component';
import { DeviceService } from '../../services/device.service';
import { loadCss } from '../testing/css-loader';
import { MockChromeService } from '../../services/testing/chrome.service.mock';
import { MockDeviceService } from '../../services/testing/device.service.mock';
import { RouterTestingModule } from '@angular/router/testing';
import { Settings, SettingsService } from '../../services/settings.service';
import { ToolbarComponent } from '../toolbar/toolbar.component';
import { WindowService } from '../../services/window.service';

describe('DeveloperComponent', () => {
    let deviceService: DeviceService;
    let chromeService: ChromeService;
    let settingsService: SettingsService;
    let windowService: WindowService;

    let comp: DeveloperComponent;
    let fixture: ComponentFixture<DeveloperComponent>;

    let settings: Settings;

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
        chromeService = TestBed.get(ChromeService);
        settingsService = TestBed.get(SettingsService);
        windowService = TestBed.get(WindowService);
    });

    describe('addDevice()', () => {
        it('Adds a fake device', (done) => {
            const addDeviceSpy = spyOn(deviceService, "addDevice").and.returnValue(Promise.resolve());
            comp.addDevice()
                .then(() => {
                    expect(addDeviceSpy).toHaveBeenCalledTimes(1);
                    done();
                })
        });
    });

    describe('resetApp()', () => {
        it('Resets the app settings', (done) => {
            const optionsUrl = "options.html";
            const resetAppSpy = spyOn(settingsService, "reset").and.returnValue(Promise.resolve());
            const getOptionsUrlSpy = spyOn(chromeService, "getOptionsUrl").and.returnValue(optionsUrl);
            const setUrlSpy = spyOn(windowService, "setUrl").and.returnValue(null);
            comp.resetApp()
                .then(() => {
                    expect(resetAppSpy).toHaveBeenCalledTimes(1);
                    expect(getOptionsUrlSpy).toHaveBeenCalledTimes(1);
                    expect(setUrlSpy).toHaveBeenCalledWith(optionsUrl);
                    done();
                });
            });
    });
});