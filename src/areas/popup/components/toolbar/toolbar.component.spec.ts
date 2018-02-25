import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Location } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';

import { loadCss } from '../testing/css-loader';
import { ToolbarComponent } from './toolbar.component';

describe('ToolbarComponent', () => {
    let location: Location;

    let comp: ToolbarComponent;
    let fixture: ComponentFixture<ToolbarComponent>;

    beforeAll(() => {
        loadCss();
    });

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ ToolbarComponent ],
            imports: [ RouterTestingModule ]
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
});