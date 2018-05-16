import { async, ComponentFixture, TestBed, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Location } from '@angular/common';

import { SquidService } from '../../../services/squid.service';
import { loadCss } from '../../testing/css-loader';
import { MockSquidService } from '../../../services/testing/squid.service.mock';
import { DeviceComponent } from './device.component';
import { Config } from '../../../../../config/config';
import { NotificationsService } from 'angular2-notifications';
import { Strings } from '../../../../../assets/strings/strings';

describe('DeviceComponent', () => {
    const strings = new Strings();
    const routeParams = {
        deviceId: 'deviceId1',
        deviceName: 'Chrome Browser',
        deviceIcon: 'laptop'
    };

    let squidService: SquidService;
    let location: Location;
    let notificationsService: NotificationsService;

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
                { provide: SquidService, useValue: new MockSquidService() },
                { 
                    provide: ActivatedRoute,
                    useValue: { snapshot: { params: routeParams }}
                },
                { provide: NotificationsService, useValue: new NotificationsService({})}
            ]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DeviceComponent);
        comp = fixture.debugElement.componentInstance;

        squidService = TestBed.get(SquidService);
        location = TestBed.get(Location);
        notificationsService = TestBed.get(NotificationsService);
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
            spyOn(notificationsService, 'info');
            spyOn(squidService, 'sendUrl').and.returnValue(Promise.resolve());
            comp.sendLink().then(() => {
                expect(squidService.sendUrl).toHaveBeenCalledWith(routeParams.deviceId, Config.squidEndpoint + '/squid/test');
                expect(notificationsService.info).toHaveBeenCalledWith(null, strings.device.linkSent);
                done();
            });
        });

        it('Shows error on error', (done) => {
            spyOn(notificationsService, 'error');
            spyOn(squidService, 'sendUrl').and.returnValue(Promise.reject('Run you fools'));
            comp.sendLink().then(() => {
                expect(notificationsService.error).toHaveBeenCalledWith(null, strings.device.error.sendLink);
                done();
            });
        });
    });

    describe('remove()', () => {
        it('Does not remove device if user does not confirm', (done) => {
            spyOn(location, 'back');
            spyOn(squidService, 'removeDevice');
            spyOn(window, 'confirm').and.returnValue(false);

            comp.remove().then(() => {
                expect(location.back).not.toHaveBeenCalled();
                expect(squidService.removeDevice).not.toHaveBeenCalled();
                done();
            });
        });

        it('Removes device if user confirms, then navigates back', (done) => {
            spyOn(location, 'back');
            spyOn(squidService, 'removeDevice').and.returnValue(Promise.resolve());
            spyOn(window, 'confirm').and.returnValue(true);

            comp.remove().then(() => {
                expect(location.back).toHaveBeenCalledTimes(1);
                expect(squidService.removeDevice).toHaveBeenCalledWith(routeParams.deviceId);
                done();
            });
        });

        it('Shows error on error', (done) => {
            spyOn(squidService, 'removeDevice').and.returnValue(Promise.reject('Save it for the Holodeck.'));
            spyOn(window, 'confirm').and.returnValue(true);
            spyOn(notificationsService, 'error');

            comp.remove().then(() => {
                expect(notificationsService.error).toHaveBeenCalledWith(null, strings.device.error.remove);
                done();
            });
        });
    });

    describe('Template', () => {
        it('Shows device title and icon', () => {
            expect(fixture.debugElement.query(By.css('.name')).nativeElement.innerHTML).toBe(routeParams.deviceName);
            expect(fixture.debugElement.query(By.css('.icon')).nativeElement.innerHTML).toBe(routeParams.deviceIcon);
        });
    });
});