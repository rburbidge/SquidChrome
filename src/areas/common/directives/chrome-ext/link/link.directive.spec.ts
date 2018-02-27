import { async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Component, ElementRef } from '@angular/core';
import { DebugElement } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { ChromeExtensionLinkDirective } from './link.directive';
import { ChromeService } from '../../../../popup/services/chrome.service';
import { MockChromeService } from '../../../../popup/services/testing/chrome.service.mock';
import { Link } from '../../../link';

@Component({
    selector: 'test-component',
    template: ''
})
class TestComponent {
    public link: Link;
}

describe('ChromeExtensionLinkDirective', () => {

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ 
                ChromeExtensionLinkDirective,
                TestComponent
            ],
            providers: [
                { provide: ChromeService, useValue: new MockChromeService() }
            ]
        });
    }));

    it('Shows link URL and text', async(() => {
        const link: Link = {
            url: 'https://www.example.com',
            text: 'Click here!'
        };

        createDirective(link)
            .then(directive => {
                expect(directive.nativeElement.innerHTML).toBe(link.text);
                expect(directive.nativeElement.getAttribute('href')).toBe(link.url);
            });
    }));

    it('Shows link URL as both URL and text', async(() => {
        const link: Link = {
            url: 'https://www.example.com',
        };

        createDirective(link)
            .then(directive => {
                expect(directive.nativeElement.innerHTML).toBe(link.url);
                expect(directive.nativeElement.getAttribute('href')).toBe(link.url);
            });
    }));

    it('ngOnInit() throws if link is not defined', () => {
        let directive = new ChromeExtensionLinkDirective(null, null);
        let exception: Error;
        
        try {
            directive.ngOnInit();
        } catch(e) {
            exception = e;
        }

        expect(exception.message).toBe('Must assign a Link to chromeExtLink directive');
    });

    function createDirective(link: Link): Promise<DebugElement> {
        TestBed.overrideComponent(TestComponent, {
            set: {
                template: '<a [chromeExtLink]="link"></a>'
            }
        });

        return TestBed.compileComponents().then(() => {
            const fixture = TestBed.createComponent(TestComponent);
            fixture.componentInstance.link = link;
            fixture.detectChanges();

            return fixture.debugElement.query(By.directive(ChromeExtensionLinkDirective));
        });
    }
});