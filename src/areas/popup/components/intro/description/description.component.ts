import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import { ChromeService } from "../../../services/chrome.service";
import { Route } from "../../../routing/route";
import { Strings } from "../../../../../assets/strings/strings";

/**
 * Shows a description of the app.
 */
@Component({
    selector: 'description',
    templateUrl: './description.html',
    styleUrls: [ './description.css' ]
})
export class DescriptionComponent {
    public readonly strings: Strings = new Strings();

    constructor(
        private readonly route: ActivatedRoute,
        private readonly chromeService: ChromeService,
        private readonly router: Router) { }

    public onNext(): Promise<any> {
        return this.chromeService.isSignedIntoChrome()
            .then(isSignedIn => {
                const newRoute = isSignedIn ? Route.intro.registerDevice : Route.intro.signIn;
                this.router.navigate([ newRoute ], { relativeTo: this.route});
            });
    }
}