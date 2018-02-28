import { Component, OnInit } from "@angular/core";

import { ChromeService } from "../../services/chrome.service";
import { Strings } from "../../../../assets/strings/strings";

@Component({
    selector: 'options',
    templateUrl: './options.html',
    styleUrls: [ './options.css' ]
})
export class OptionsComponent implements OnInit {
    public readonly strings: Strings = new Strings();
    
    public isDevMode: boolean;

    constructor(private readonly chrome: ChromeService) { }

    ngOnInit(): void {
        this.isDevMode = this.chrome.isDevMode();
    }
}