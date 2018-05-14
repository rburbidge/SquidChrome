import { Component, OnInit, HostListener } from "@angular/core";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";
import { ActivatedRoute } from "@angular/router";
import { NotificationsService } from "angular2-notifications";

import { Strings } from "../../../../../assets/strings/strings";
import { Config } from "../../../../../config/config";
import { SquidMessage } from "../../../../../contracts/squid";
import { WindowService } from "../../../services/window.service";
import * as PromiseHelpers from '../../../../common/promise-helpers';
import { TelemetryService } from "../../../services/telemetry.service";
import { serializeQueryParams } from "../../../../common/http-helpers";

const iframeTimeoutMillis = 5000;

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

    private startMillis: number;
    private loaded: boolean = false;
    private strings = new Strings();

    constructor(
        private readonly window: WindowService,
        private readonly sanitizer: DomSanitizer,
        private readonly telemetry: TelemetryService, 
        private readonly route: ActivatedRoute, 
        private notifications: NotificationsService) { }

    @HostListener('window:message', ['$event'])
    public onWindowMessage(ev: MessageEvent): void {
        const message: SquidMessage = ev.data;
        if(message.type == 'heightChanged') {
            this.contentHeight = message.data;
            this.class = "fade-in";
            this.loaded = true;
            this.logTelemetry(performance.now() - this.startMillis, true);
        }
    }

    ngOnInit(): Promise<void> {
        this.startMillis = performance.now();
        this.contentUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.createSourceUrl());
        return PromiseHelpers.delay(iframeTimeoutMillis)
            .then(() => {
                if(!this.loaded) {
                    this.notifications.error(null, this.strings.error.iframeError);
                    this.logTelemetry(performance.now() - this.startMillis, false);
                }
            });
    }

    private createSourceUrl(): string {
        const baseInstructionsUrl = Config.squidEndpoint + this.route.snapshot.data['squidPath'];
        return baseInstructionsUrl + '?' + serializeQueryParams(
            {
                client: 'chrome-ext',
                origin: this.window.getOrigin()
            });
    }

    private logTelemetry(totalTimeMillis: number, success: boolean): void {
        this.telemetry.trackIFrameDependency('SquidService', this.createSourceUrl(), totalTimeMillis, success);
    }
}