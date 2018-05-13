import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChromeService } from '../../../services/chrome.service';
import { loadCss } from '../../testing/css-loader';
import { MockChromeService } from '../../../services/testing/chrome.service.mock';
import { SignedOutComponent } from './signed-out.component';
import { IntroBottomComponent } from '../intro-bottom/intro-bottom.component';

describe('SignedOutComponent', () => {
    let chromeService: ChromeService;

    let comp: SignedOutComponent;
    let fixture: ComponentFixture<SignedOutComponent>;

    beforeAll(() => {
        loadCss();
    });

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ IntroBottomComponent, SignedOutComponent ],
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
        it('Calls ChromeService.signIntoChrome()', (done) => {
            const signInSpy = spyOn(chromeService, 'signIntoChrome').and.returnValue(Promise.resolve(true));

            comp.signIn()
                .then(() => {
                    expect(signInSpy).toHaveBeenCalledTimes(1);
                    done();
                });
        });
    });
});