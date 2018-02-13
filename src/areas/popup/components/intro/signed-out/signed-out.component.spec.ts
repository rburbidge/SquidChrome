import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChromeService } from '../../../services/chrome.service';
import { loadCss } from '../../testing/css-loader';
import { MockChromeService } from '../../../services/testing/chrome.service.mock';
import { SignedOutComponent } from './signed-out.component';

describe('SignedOutComponent', () => {
    let chromeService: ChromeService;

    let comp: SignedOutComponent;
    let fixture: ComponentFixture<SignedOutComponent>;

    beforeAll(() => {
        loadCss();
    });

    beforeEach(async(() => {
        let mockRouter = {
            navigate: jasmine.createSpy('navigate'),
            navigateByUrl: () => {}
          };

        TestBed.configureTestingModule({
            declarations: [ SignedOutComponent ],
            providers: [
                { provide: ChromeService, useValue: new MockChromeService() }
            ]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SignedOutComponent);
        comp = fixture.debugElement.componentInstance;

        chromeService = TestBed.get(ChromeService);
    })

    describe('signIn()', () => {
        it('Opens the page if the user signs in', (done) => {
            const signInSpy = spyOn(chromeService, 'signIntoChrome').and.returnValue(Promise.resolve(true));

            comp.signIn()
                .then(() => {
                    expect(signInSpy).toHaveBeenCalledTimes(1);
                    done();
                });
        });
    });
});