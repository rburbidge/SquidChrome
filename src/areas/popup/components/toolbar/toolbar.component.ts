import { Component, Input } from "@angular/core";
import { Location } from '@angular/common';

import { Strings } from "../../../../assets/strings/strings";

@Component({
    selector: 'squid-toolbar',
    templateUrl: './toolbar.html',
    styleUrls: [ './toolbar.css' ]
})
export class ToolbarComponent {
    public readonly strings: Strings = new Strings();

    @Input("showLogo") showSquidLogo: boolean;
    @Input("showOptions") showOptionsButton: boolean;
    @Input("showBack") showBackButton: boolean;
    @Input() title: string = this.strings.title;

    constructor(private readonly location: Location) { }

    back(): void {
        this.location.back();
    }
}