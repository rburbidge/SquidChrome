import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { AboutComponent } from './about.component';
import { AttributionComponent } from './attribution/attribution.component';
import { ChromeExtensionLinkDirective } from '../../../../common/directives/chrome-ext/link/link.directive';
import { ChromeService } from '../../../services/chrome.service';
import { loadCss } from '../../testing/css-loader';
import { MockChromeService } from '../../../services/testing/chrome.service.mock';
import { ToolbarComponent } from '../../toolbar/toolbar.component';

describe('AboutComponent', () => {
    let chromeService: ChromeService;

    let comp: AboutComponent;
    let fixture: ComponentFixture<AboutComponent>;

    beforeAll(() => {
        loadCss([
            'areas/popup/components/toolbar/toolbar.css',
            'areas/popup/components/about/about.css',
            'areas/popup/components/about/attribution/attribution.css']);
    });

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ AttributionComponent, AboutComponent, ChromeExtensionLinkDirective, ToolbarComponent ],
            imports: [ RouterTestingModule ],
            providers: [
                { provide: ChromeService, useValue: new MockChromeService() }
            ]
        })
        .compileComponents();
    }));

    it('Template', () => {
        fixture = TestBed.createComponent(AboutComponent);
        fixture.detectChanges();
    });
});