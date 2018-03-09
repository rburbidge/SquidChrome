import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { ChromeService } from '../../../services/chrome.service';
import { loadCss } from '../../testing/css-loader';
import { MockChromeService } from '../../../services/testing/chrome.service.mock';
import { OptionsListComponent } from './options-list.component';

describe('OptionsListComponent', () => {
    let chromeService: ChromeService;

    let comp: OptionsListComponent;
    let fixture: ComponentFixture<OptionsListComponent>;

    beforeAll(() => {
        loadCss([
            'areas/popup/components/options/options-list/options-list.css'
        ]);
    });

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ OptionsListComponent ],
            imports: [ RouterTestingModule ],
            providers: [
                { provide: ChromeService, useValue: new MockChromeService() }
            ]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(OptionsListComponent);
        comp = fixture.debugElement.componentInstance;

        chromeService = TestBed.get(ChromeService);
    });

    it('isDevMode is true', () => {
        spyOn(chromeService, 'isDevMode').and.returnValue(true);

        fixture.detectChanges();
        expect(comp.isDevMode).toBeTruthy();
    });

    it('isDevMode is false', () => {
        spyOn(chromeService, 'isDevMode').and.returnValue(false);

        fixture.detectChanges();
        expect(comp.isDevMode).toBeFalsy();
    });
});