import { Component, OnInit } from '@angular/core';

import { Strings } from '../../../../assets/strings/strings';

@Component({
    selector: 'options',
    templateUrl: './options.html',
    styleUrls: [ './options.css' ]
})
export class OptionsComponent {
    public readonly strings: Strings = new Strings();

    constructor() { }
}