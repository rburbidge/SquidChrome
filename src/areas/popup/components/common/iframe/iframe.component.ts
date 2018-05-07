import { Component, OnInit, Sanitizer, HostListener, Input } from "@angular/core";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";
import { Route, ActivatedRoute } from "@angular/router";
import $ from 'jquery';

import { Strings } from "../../../../../assets/strings/strings";
import { SettingsService } from "../../../services/settings.service";
import { Config } from "../../../../../config/config";
import { SquidMessage } from "../../../../../contracts/squid";
import { WindowService } from "../../../services/window.service";

/**
 * Shows instructions content for the app.
 */
@Component({
    // Do NOT use 'iframe' because the template for this component includes 'iframe', and that causes a stack overflow
    // of components
    selector: 'iframe-component',
    templateUrl: './iframe.html',
    styleUrls: [ './iframe.css' ]
})
export class IFrameComponent implements OnInit {
    public contentUrl: SafeUrl;
    public contentHeight: string = "0";
    public class: string;

    constructor(private readonly window: WindowService, private readonly sanitizer: DomSanitizer, private readonly route: ActivatedRoute) { }

    @HostListener('window:message', ['$event'])
    public onWindowMessage(ev: MessageEvent): void {
        const message: SquidMessage = ev.data;
        if(message.type == 'heightChanged') {
            this.contentHeight = message.data;
            this.class = "fade-in";
        }
    }

    ngOnInit(): void {
        this.contentUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.createInstructionsUrl());
    }

    private createInstructionsUrl(): string {
        const baseInstructionsUrl = Config.squidEndpoint + this.route.snapshot.data['squidPath'];
        return baseInstructionsUrl + '?' + $.param(
            {
                client: 'chrome-ext',
                origin: this.window.getOrigin()
            });
    }
}