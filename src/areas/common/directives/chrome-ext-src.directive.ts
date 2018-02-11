import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[chromeExtSrc]'
})
export class ChromeExtensionSourceDirective implements OnInit {
    @Input('chromeExtSrc') imageUrl: string;

    constructor(private readonly el: ElementRef) { }

    ngOnInit(): void {
        const chromeExtensionImageUrl = chrome.extension.getURL(this.imageUrl);
        this.el.nativeElement.setAttribute('src', chromeExtensionImageUrl)
    }
}