import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IntroComponent } from './intro.component';
import { RouterTestingModule } from '@angular/router/testing';
import { SettingsService } from '../../services/settings.service';

describe('IntroComponent', () => {
    let comp: IntroComponent;
    let fixture: ComponentFixture<IntroComponent>;
    let settingsService: SettingsService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ IntroComponent ],
            imports: [ RouterTestingModule ],
            providers: [ SettingsService ]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(IntroComponent);
        comp = fixture.debugElement.componentInstance;

        settingsService = TestBed.get(SettingsService);
    })

    describe('ngOnInit()', () => {
        it('Resets app settings', (done) => {
            spyOn(settingsService, 'reset').and.returnValue(Promise.resolve());
            comp.ngOnInit()
                .then(() => {
                    expect(settingsService.reset).toHaveBeenCalledTimes(1);
                    done();
                });
        });
    });
});