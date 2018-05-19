import { Component, EventEmitter, Output, OnInit, Input } from "@angular/core";

import { Strings } from "../../../../../assets/strings/strings";
import { SquidService } from "../../../services/squid.service";
import { ErrorModel, Content } from "../../../../../contracts/squid";
import { SettingsService } from "../../../services/settings.service";

/**
 * Shows the history of the content that the user has sent.
 */
@Component({
    selector: 'history',
    templateUrl: './history.html',
    styleUrls: [ './history.css' ]
})
export class HistoryComponent implements OnInit {
    public readonly strings: Strings = new Strings();
    public isLoading: boolean = true;
    public content: Content[];

    constructor(
        private readonly squidService: SquidService) { }

    public async refreshContent(): Promise<void> {
        this.isLoading = true;
        this.content = undefined;
        this.content = await this.squidService.getContent();
        this.isLoading = false;
    }

    public ngOnInit(): Promise<void> {
        return this.refreshContent();
    }
}