import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Location } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';

import { AddAnotherDeviceComponent } from './add-another-device.component';
import { Config } from '../../../../config/config';
import { ChromeService } from '../../services/chrome.service';
import { loadCss } from '../testing/css-loader';
import { MockChromeService } from '../../services/testing/chrome.service.mock';

describe('AddAnotherDeviceComponent', () => {
    const config = new Config();

    let chromeService: ChromeService;
    let location: Location;

    let comp: AddAnotherDeviceComponent;
    let fixture: ComponentFixture<AddAnotherDeviceComponent>;

    beforeAll(() => {
        loadCss();
    });

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ AddAnotherDeviceComponent ],
            imports: [ RouterTestingModule ],
            providers: [
                { provide: ChromeService, useValue: new MockChromeService() },
            ]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AddAnotherDeviceComponent);
        comp = fixture.debugElement.componentInstance;

        chromeService = TestBed.get(ChromeService);
        location = TestBed.get(Location);
    });

    it('openPlayStore() opens play store', () => {
        spyOn(chromeService, 'openTab');
        comp.openPlayStore();
        expect(chromeService.openTab).toHaveBeenCalledWith(config.googlePlayStore);
    });

    it('openPlayStore() opens chrome web store', () => {
        spyOn(chromeService, 'openTab');
        comp.openChromeWebStore();
        expect(chromeService.openTab).toHaveBeenCalledWith(config.chromeWebStore);
    });

    it('back() navigates back', () => {
        spyOn(location, 'back');
        comp.back();
        expect(location.back).toHaveBeenCalledTimes(1);
    })
});