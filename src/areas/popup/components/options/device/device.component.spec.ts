import { async, ComponentFixture, TestBed, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Location } from '@angular/common';

import { ChromeService } from '../../../services/chrome.service';
import { DeviceModel, DeviceType, ErrorCode, ErrorModel } from '../../../../../contracts/squid';
import { DeviceService } from '../../../services/device.service';
import { loadCss } from '../../testing/css-loader';
import { MockDeviceService } from '../../../services/testing/device.service.mock';
import { Settings, SettingsService } from '../../../services/settings.service';
import { DeviceComponent } from './device.component';

describe('DeviceComponent', () => {
    const routeParams = {
        deviceId: 'deviceId1',
        deviceName: 'Chrome Browser',
        deviceIcon: 'laptop'
    };

    let deviceService: DeviceService;
    let location: Location;

    let comp: DeviceComponent;
    let fixture: ComponentFixture<DeviceComponent>;

    beforeAll(() => {
        loadCss(['areas/popup/components/options/device/device.css']);
    });

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ DeviceComponent ],
            imports: [ RouterTestingModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true },
                { provide: DeviceService, useValue: new MockDeviceService() },
                { 
                    provide: ActivatedRoute,
                    useValue: { snapshot: { params: routeParams }}
                }
            ]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DeviceComponent);
        comp = fixture.debugElement.componentInstance;

        deviceService = TestBed.get(DeviceService);
        location = TestBed.get(Location);
    });

    describe('ngOnInit()', () => {
        it('Sets fields using route params', () => {
            comp.ngOnInit();
            expect(comp.deviceId).toBe(routeParams.deviceId);
            expect(comp.deviceName).toBe(routeParams.deviceName);
            expect(comp.deviceIcon).toBe(routeParams.deviceIcon);
        });
    });

    describe('sendLink()', () => {
        it('Sends a link', (done) => {
            spyOn(deviceService, 'sendUrl').and.returnValue(Promise.resolve());
            comp.sendLink().then(() => {
                expect(deviceService.sendUrl).toHaveBeenCalledWith(routeParams.deviceId, 'https://www.google.com');
                done();
            });
        });
    });

    describe('remove()', () => {
        it('Does not remove device if user does not confirm', (done) => {
            spyOn(location, 'back');
            spyOn(deviceService, 'removeDevice');
            spyOn(window, 'confirm').and.returnValue(false);

            comp.remove().then(() => {
                expect(location.back).not.toHaveBeenCalled();
                expect(deviceService.removeDevice).not.toHaveBeenCalled();
                done();
            });
        });

        it('Removes device if user confirms, then navigates back', (done) => {
            spyOn(location, 'back');
            spyOn(deviceService, 'removeDevice').and.returnValue(Promise.resolve());
            spyOn(window, 'confirm').and.returnValue(true);

            comp.remove().then(() => {
                expect(location.back).toHaveBeenCalledTimes(1);
                expect(deviceService.removeDevice).toHaveBeenCalledWith(routeParams.deviceId);
                done();
            });
        });
    });
});