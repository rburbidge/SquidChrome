import { Directive, ElementRef, Input, OnInit } from '@angular/core';

/**
 * Converts a relative URL to an absolute chrome extension URL, e.g. for displaying images in a chrome extension.
 * @param chromeExtSrc The relative URL from the project root (where the manifest is).
 * 
 * Assigns the input parameter to the src attribute of the applied element.
 * E.g. Using an img tag, but any tag will work.
 * <img chromeExtSrc="src/assets/images/squid_head.png"/>
 */
@Directive({
  selector: '[chromeExtSrc]'
})
export class ChromeExtensionSourceDirective implements OnInit {
    @Input('chromeExtSrc') relativeSourceUrl: string;

    constructor(private readonly el: ElementRef) { }

    ngOnInit(): void {
        const chromeExtSourceUrl = chrome.extension.getURL(this.relativeSourceUrl);
        this.el.nativeElement.setAttribute('src', chromeExtSourceUrl)
    }
}