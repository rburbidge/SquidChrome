import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ComponentFixtureAutoDetect } from '@angular/core/testing';
import { Location } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';

import { loadCss } from '../testing/css-loader';
import { ToolbarComponent } from './toolbar.component';
import { By } from '@angular/platform-browser';
import { click } from '../../../../test/helpers';

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
        it('Shows back button', () => {
            spyOn(comp, 'back');
            comp.showBackButton = true;
            fixture.detectChanges();
            let de = fixture.debugElement.query(By.css('.back'));

            click(de);
            expect(comp.back).toHaveBeenCalledTimes(1);
        });

        it('Shows options button', () => {
            comp.showOptionsButton = true;
            fixture.detectChanges();
            let de = fixture.debugElement.query(By.css('.settings'));

            expect(de).toBeTruthy();
        });

        it('Shows logo', () => {
            comp.showSquidLogo = true;
            fixture.detectChanges();
            let de = fixture.debugElement.query(By.css('.logo'));
            
            expect(de).toBeTruthy();
        });

        it('Shows title', () => {
            comp.title = 'Foobar';
            fixture.detectChanges();
            let de = fixture.debugElement.query(By.css('.title'));
            
            expect(de.nativeElement.textContent).toBe(comp.title);
        });
    });
});