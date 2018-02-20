import { Component } from "@angular/core";

import { Strings } from "../../../../assets/strings/strings";

@Component({
    selector: 'squid-menu',
    templateUrl: './menu.html',
    styleUrls: [ './menu.css' ]
})
export class MenuComponent {
    public readonly strings: Strings = new Strings();

    constructor() { }
}