import { Directive, ElementRef, HostListener, Input } from "@angular/core";
import { ChromeService } from "../../popup/services/chrome.service";
import { Link } from "../link";

@Directive({
    selector: '[chromeExtLink]'
})
export class ChromeExtensionLinkDirective {
    @Input() chromeExtLink: Link;

    constructor(
        private readonly el: ElementRef,
        private readonly chrome: ChromeService) { }

    ngOnInit(): void {
        if(!this.chromeExtLink) {
            throw new Error('Must assign a Link to chromeExtLink directive');
        }

        this.el.nativeElement.innerHTML = this.chromeExtLink.text || this.chromeExtLink.url;

        // We technically don't need to set the href since opening of the tab is handled by onClick(), but set it so
        // that the browser styles the link properly
        this.el.nativeElement.setAttribute('href', this.chromeExtLink.url);
    }

    @HostListener('click') onClick() {
        this.chrome.openTab(this.chromeExtLink.url);
    }
}