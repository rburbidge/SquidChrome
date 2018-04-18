import { Component, OnInit, Sanitizer, HostListener } from "@angular/core";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";

import { Strings } from "../../../../../assets/strings/strings";
import { SettingsService } from "../../../services/settings.service";
import { Config } from "../../../../../config/config";
import $ from 'jquery';
import { SquidMessage } from "../../../../../contracts/squid";
import { WindowService } from "../../../services/window.service";

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

    constructor(private readonly window: WindowService, private readonly sanitizer: DomSanitizer) { }

    @HostListener('window:message', ['$event'])
    public onWindowMessage(ev: MessageEvent): void {
        const message: SquidMessage = ev.data;
        if(message.type == 'heightChanged') {
            this.contentHeight = message.data;
        }
    }

    ngOnInit(): void {
        this.contentUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.createInstructionsUrl());
    }

    private createInstructionsUrl(): string {
        const baseInstructionsUrl = Config.squidEndpoint + "/squid/instructions.html";
        return baseInstructionsUrl + '?' + $.param(
            {
                client: 'chrome-ext',
                origin: this.window.getOrigin()
            });
    }
}