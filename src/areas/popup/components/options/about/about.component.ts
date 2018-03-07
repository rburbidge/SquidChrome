import { Component } from "@angular/core";

import { Strings } from "../../../../../assets/strings/strings";

/**
 * Shows about content for the app.
 */
@Component({
    selector: 'about',
    templateUrl: './about.html',
    styleUrls: [ './about.css' ]
})
export class AboutComponent {
    public readonly strings: Strings = new Strings();
}