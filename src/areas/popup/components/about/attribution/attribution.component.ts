import { Component, Input } from "@angular/core";

import { Strings } from "../../../../../assets/strings/strings";
import { Link } from "../../../../common/link";

/**
 * Shows an attribution including a link to the source and a link to the license under which it is provided.
 */
@Component({
    selector: 'attribution',
    templateUrl: './attribution.html',
    styleUrls: [ './attribution.css' ]
})
export class AttributionComponent {
    public readonly strings: Strings = new Strings();

    @Input() str: string;
    @Input() link: Link;
    @Input() license: Link;
}