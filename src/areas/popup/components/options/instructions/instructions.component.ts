import { Component, OnInit, Sanitizer, HostListener } from "@angular/core";

import { Strings } from "../../../../../assets/strings/strings";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";
import { SettingsService } from "../../../services/settings.service";
import { Config } from "../../../../../config/config";
import $ from 'jquery';
import { SquidMessage } from "../../../../../contracts/squid";

/**
 * Shows instructions content for the app.
 */
@Component({
    selector: 'instructions',
    templateUrl: './instructions.html',
    styleUrls: [ './instructions.css' ]
})
export class InstructionsComponent implements OnInit {
    public contentUrl: SafeUrl;
    public contentHeight: string = "0";

    constructor(private readonly sanitizer: DomSanitizer) { }

    @HostListener('window:message', ['$event'])
    public onWindowMessage(ev: MessageEvent): void {
        const message: SquidMessage = ev.data;
        if(message.type == 'heightChanged') {
            this.contentHeight = message.data;
        }
    }

    ngOnInit(): void {
        this.contentUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
            InstructionsComponent.createInstructionsUrl());
    }

    private static createInstructionsUrl(): string {
        const baseInstructionsUrl = Config.squidEndpoint + "/squid/instructions.html";
        return baseInstructionsUrl + '?' + $.param(
            {
                client: 'chrome-ext',
                origin: window.location.origin
            });
    }
}