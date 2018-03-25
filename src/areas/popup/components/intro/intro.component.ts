import { Component, OnInit } from "@angular/core";
import { SettingsService } from "../../services/settings.service";

/**
 * The intro component that shows a series of sub-components allowing the user to setup the app.
 */
@Component({
    selector: 'intro',
    templateUrl: './intro.html',
    styleUrls: ['./intro.css']
})
export class IntroComponent implements OnInit {
    constructor(private readonly settingsService: SettingsService) { }

    ngOnInit(): Promise<void> {
        return this.settingsService.reset();
    }
}