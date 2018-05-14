import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';

import { ChromeService } from '../../../services/chrome.service';
import { loadCss } from '../../testing/css-loader';
import { DescriptionComponent } from './description.component';
import { IntroBottomComponent } from '../intro-bottom/intro-bottom.component';
import { MockChromeService } from '../../../services/testing/chrome.service.mock';
import { Route } from '../../../routing/route';
import { RouterTestingModule } from '@angular/router/testing';

describe('DescriptionComponent', () => {
    let chromeService: ChromeService;
    let router: Router;

    let comp: DescriptionComponent;
    let fixture: ComponentFixture<DescriptionComponent>;

    beforeAll(() => {
        loadCss();
    });

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ IntroBottomComponent, DescriptionComponent ],
            imports: [ RouterTestingModule ],
            providers: [
                { provide: ActivatedRoute, useValue: 'foo' }, // We just check that this is passed to router.navigate()
                { provide: ChromeService, useValue: new MockChromeService() }
            ]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DescriptionComponent);
        comp = fixture.debugElement.componentInstance;

        chromeService = TestBed.get(ChromeService);
        router = TestBed.get(Router);
    })

    describe('next()', () => {
        it('Navigates to the sign-in component', (done) => {
            spyOn(chromeService, 'isSignedIntoChrome').and.returnValue(Promise.resolve(false));
            const navigate = spyOn(router, 'navigate');

            comp.onNext()
                .then(() => {
                    expect(navigate).toHaveBeenCalledWith([Route.intro.signIn], Object({ relativeTo: 'foo' }));
                    done();
                });
        });
    });
});