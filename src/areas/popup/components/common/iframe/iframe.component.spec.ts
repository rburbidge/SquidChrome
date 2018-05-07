import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { IFrameComponent } from './iframe.component';
import { ChromeExtensionLinkDirective } from '../../../../common/directives/chrome-ext/link/link.directive';
import { loadCss } from '../../testing/css-loader';
import { ToolbarComponent } from '../../toolbar/toolbar.component';
import { WindowService } from '../../../services/window.service';
import { TelemetryService } from '../../../services/telemetry.service';
import { NotificationsService } from 'angular2-notifications';

describe('IFrameComponent', () => {
    let window: WindowService;

    let comp: IFrameComponent;
    let fixture: ComponentFixture<IFrameComponent>;

    beforeAll(() => {
        loadCss([
            'areas/popup/components/toolbar/toolbar.css',
            'areas/popup/components/options/instructions/instructions.css']);
    });

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ IFrameComponent, ToolbarComponent ],
            imports: [ RouterTestingModule ],
            providers: [
                { provide: WindowService, useValue: new WindowService() },
                { provide: TelemetryService, useValue: new TelemetryService() },
                { provide: NotificationsService, useValue: new NotificationsService({}) }
            ]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        window = TestBed.get(WindowService);

        fixture = TestBed.createComponent(IFrameComponent);
        comp = fixture.componentInstance;

        const telemetry = TestBed.get(TelemetryService);
        spyOn(telemetry, 'trackIFrameDependency');

    });

    it('iframe height is set on window heightChanged message', () => {
        fixture = TestBed.createComponent(IFrameComponent);
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