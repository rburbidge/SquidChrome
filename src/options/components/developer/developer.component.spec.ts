import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { Router } from '@angular/router';

import { ChromeService } from '../../services/chrome.service';
import { DeveloperComponent } from '../developer/developer.component';
import { DeviceService } from '../../services/device.service';
import { loadCss } from '../testing/css-loader';
import { MockChromeService } from '../../services/testing/chrome.service.mock';
import { MockDeviceService } from '../../services/testing/device.service.mock';
import { RouterTestingModule } from '@angular/router/testing';
import { Settings, SettingsService } from '../../services/settings.service';

describe('DeveloperComponent', () => {
    let deviceService: DeviceService;
    let chromeService: ChromeService;
    let settingsService: SettingsService;
    let router: Router;

    let comp: DeveloperComponent;
    let fixture: ComponentFixture<DeveloperComponent>;

    let settings: Settings;

    beforeAll(() => {
        loadCss();
    });

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ DeveloperComponent ],
            imports: [ RouterTestingModule ],
            providers: [
                { provide: ChromeService, useValue: new MockChromeService() },
                { provide: DeviceService, useValue: new MockDeviceService() },
                { provide: SettingsService, useValue: new SettingsService() },
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
        router = TestBed.get(Router);
    })

    describe('addDevice()', () => {
        it('Adds a fake device', () => {
            const addDeviceSpy = spyOn(deviceService, "addDevice").and.returnValue(Promise.resolve());
            comp.addDevice()
                .then(() => {
                    expect(addDeviceSpy).toHaveBeenCalledTimes(1);
                })
        })
    });
});