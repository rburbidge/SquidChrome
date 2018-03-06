import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Strings } from '../../../../../assets/strings/strings';

@Component({
    selector: 'manage-devices',
    templateUrl: './manage-devices.html',
    styleUrls: ['./manage-devices.css']
})
export class ManageDevicesComponent {
    public readonly strings: Strings = new Strings();
    public error: string;

    constructor() { }

    private onLoad(): void {
    }

    private onError(error: string): void {
        this.error = error;
    }
}