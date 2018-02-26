import { Component, Input } from "@angular/core";

import { Strings } from "../../../../../assets/strings/strings";
import { Link } from "../../../../common/link";

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

    constructor() {
    }
}