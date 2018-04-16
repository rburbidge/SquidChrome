import { Component, OnInit, Sanitizer } from "@angular/core";

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
    public instructionsUrl: SafeUrl;

    constructor(private readonly sanitizer: DomSanitizer) { }

    ngOnInit(): void {
        this.instructionsUrl = this.sanitizer.bypassSecurityTrustResourceUrl(InstructionsComponent.createInstructionsUrl());

        window.onmessage = (ev: MessageEvent) => {
            const message: SquidMessage = ev.data;
            if(message.type == 'heightChanged') {
                const iframe = $('iframe')[0] as HTMLIFrameElement;
                iframe.height = message.data;
            }
        };
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