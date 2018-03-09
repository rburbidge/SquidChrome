import { Component, OnInit } from "@angular/core";

import { ChromeService } from "../../../services/chrome.service";
import { Strings } from "../../../../../assets/strings/strings";

/**
 * Shows the list of options.
 */
@Component({
    selector: 'options-list',
    templateUrl: './options-list.html',
    styleUrls: [ './options-list.css' ]
})
export class OptionsListComponent implements OnInit {
    public readonly strings: Strings = new Strings();

    public isDevMode: boolean;

    constructor(private readonly chrome: ChromeService) { }

    ngOnInit(): void {
        this.isDevMode = this.chrome.isDevMode();
    }
}