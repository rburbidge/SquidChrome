import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import { ChromeService } from "../../../services/chrome.service";
import { Route } from "../../../routing/route";

/**
 * The select device page for the pop-up. Allows the user to manage their registered devices.
 */
@Component({
    selector: 'description',
    templateUrl: './description.html'
})
export class DescriptionComponent {
    constructor(
        private readonly route: ActivatedRoute,
        private readonly chromeService: ChromeService,
        private readonly router: Router) { }

    public onNext(): Promise<any> {
        return this.chromeService.isSignedIntoChrome()
            .then(isSignedIn => {
                let newRoute: string;
                if(!isSignedIn) {
                    newRoute = Route.intro.signIn
                } else {
                    newRoute = Route.intro.registerDevice;
                }

                this.router.navigate([ newRoute ], { relativeTo: this.route});
            });
    }
}