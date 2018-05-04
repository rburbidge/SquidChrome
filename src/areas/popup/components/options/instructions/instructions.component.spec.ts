import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { InstructionsComponent } from './instructions.component';
import { ChromeExtensionLinkDirective } from '../../../../common/directives/chrome-ext/link/link.directive';
import { loadCss } from '../../testing/css-loader';
import { ToolbarComponent } from '../../toolbar/toolbar.component';
import { WindowService } from '../../../services/window.service';

describe('InstructionsComponent', () => {
    let window: WindowService;

    let comp: InstructionsComponent;
    let fixture: ComponentFixture<InstructionsComponent>;

    beforeAll(() => {
        loadCss([
            'areas/popup/components/toolbar/toolbar.css',
            'areas/popup/components/options/instructions/instructions.css']);
    });

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ InstructionsComponent, ToolbarComponent ],
            imports: [ RouterTestingModule ],
            providers: [
                { provide: WindowService, useValue: new WindowService() }
            ]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        window = TestBed.get(WindowService);

        fixture = TestBed.createComponent(InstructionsComponent);
        comp = fixture.componentInstance;
    });

    it('iframe height is set on window heightChanged message', () => {
        fixture = TestBed.createComponent(InstructionsComponent);
        fixture.detectChanges();
        
        const message: MessageEvent = {
            data: {
                type: 'heightChanged',
                data: '25px'
            }
        } as MessageEvent;

        comp.onWindowMessage(message);
        expect(comp.contentHeight).toBe('25px');
    });
});