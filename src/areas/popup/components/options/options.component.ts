import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';

/**
 * Frame for the options page. Shows the toolbar with appropriate title as well as the current options sub-component.
 */
@Component({
    selector: 'options',
    templateUrl: './options.html',
    styleUrls: [ './options.css' ]
})
export class OptionsComponent {
    public title: string

    constructor(private readonly route: ActivatedRoute, private readonly router: Router) { }

    public ngOnInit(): void {
        this.updateTitle();

        // Update the toolbar title when the route changes
        this.router.events.subscribe(val => {
            if(val instanceof NavigationEnd) {
                this.updateTitle();
            }
        });
    }

    /**
     * Sets the component title to the title of the current route.
     * The title will be set to the title of the most-leaf-node child route.
     */
    private updateTitle(): void {
        let currentRoute = this.route;
        let title: string = currentRoute.snapshot.data.title;
        while(currentRoute.firstChild) {
            currentRoute = currentRoute.firstChild;
            if(currentRoute.snapshot.data.title) {
                title = currentRoute.snapshot.data.title;
            }
        }
        this.title = title;
    }
}