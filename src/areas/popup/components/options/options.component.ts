import { Component } from "@angular/core";

import { ChromeService } from "../../services/chrome.service";
import { Strings } from "../../../../assets/strings/strings";

@Component({
    selector: 'options',
    templateUrl: './options.html',
    styleUrls: [ './options.css' ]
})
export class OptionsComponent {
    public readonly strings: Strings = new Strings();

    public readonly isDevMode: boolean;

    constructor(private readonly chrome: ChromeService) {
        this.isDevMode = chrome.isDevMode();
    }
}