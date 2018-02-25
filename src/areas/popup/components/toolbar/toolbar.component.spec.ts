import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ComponentFixtureAutoDetect } from '@angular/core/testing';
import { Location } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';

import { loadCss } from '../testing/css-loader';
import { click } from '../../../../test/helpers';
import { ToolbarComponent } from './toolbar.component';

describe('ToolbarComponent', () => {
    let location: Location;

    let comp: ToolbarComponent;
    let fixture: ComponentFixture<ToolbarComponent>;

    beforeAll(() => {
        loadCss(['areas/popup/components/toolbar/toolbar.css']);
    });

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ ToolbarComponent ],
            imports: [ RouterTestingModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ToolbarComponent);
        comp = fixture.debugElement.componentInstance;

        location = TestBed.get(Location);
    });

    it('back() navigates back', () => {
        spyOn(location, 'back');
        comp.back();
        expect(location.back).toHaveBeenCalledTimes(1);
    });

    describe('Template', () => {
        it('Back button is shown and can be clicked', () => {
            spyOn(comp, 'back');
            comp.showBackButton = true;
            fixture.detectChanges();
            let de = fixture.debugElement.query(By.css('.back'));

            click(de);
            expect(comp.back).toHaveBeenCalledTimes(1);
        });

        it('Back button is not shown', () => {
            comp.showBackButton = false;
                testElementNotShownByCss('.back');
        });

        it('Options button is shown', () => {
            comp.showOptionsButton = true;
            testElementShownByCss('.settings');
        });

        it('Options button is not shown', () => {
            comp.showOptionsButton = false;
            testElementNotShownByCss('.settings');
        });

        it('Logo is shown', () => {
            comp.showLogo = true;
            testElementShownByCss('.logo');
        });

        it('Logo is not shown', () => {
            comp.showLogo = false;
            testElementNotShownByCss('.logo');
        });

        it('Title is shown as default value', () => {
            fixture.detectChanges();
            let de = fixture.debugElement.query(By.css('.title'));
            
            expect(de.nativeElement.textContent).toBe('Squid');
        });

        it('Title is shown and as inputted value', () => {
            comp.title = 'Foobar';
            fixture.detectChanges();
            let de = fixture.debugElement.query(By.css('.title'));
            
            expect(de.nativeElement.textContent).toBe(comp.title);
        });

        function testElementNotShownByCss(cssSelector: string) {
            fixture.detectChanges();
            let de = fixture.debugElement.query(By.css(cssSelector));
            expect(de).toBeFalsy(`${cssSelector} was shown, but expected it not to be shown`);
        }

        function testElementShownByCss(cssSelector: string) {
            fixture.detectChanges();
            let de = fixture.debugElement.query(By.css(cssSelector));
            expect(de).toBeTruthy(`${cssSelector} was not shown, but expected it be shown`);
        }
    });
});