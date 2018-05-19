import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';

import { ChromeService } from '../../services/chrome.service';
import { SquidService } from '../../services/squid.service';
import { Route } from '../../routing/route';
import { Strings } from '../../../../assets/strings/strings';
import { SettingsService } from '../../services/settings.service';
import { NotificationsService } from 'angular2-notifications';

/**
 * Shows the user's devices. Selecting a device sends the current tab's URL to that device.
 */
@Component({
    selector: 'home',
    templateUrl: './home.html',
    styleUrls: ['./home.css']
})
export class HomeComponent implements OnInit {
    public readonly strings: Strings = new Strings();
    public isLoading: boolean = true;
    public error: string;
    public route: string;
    public readonly tabs = [
        {
            routerLink: Route.home.share,
            title: this.strings.share.title
        },
        {
            routerLink: Route.home.history,
            title: this.strings.history.title
        },
        {
            routerLink: Route.home.devices,
            title: this.strings.devices.title
        },
    ];
    
    constructor(
        private readonly squidService: SquidService,
        private readonly router: Router,
        private readonly activatedRoute: ActivatedRoute,
        private readonly chromeService: ChromeService,
        private readonly settingsService: SettingsService,
        private readonly notifications: NotificationsService)
    {
        this.router.events.subscribe(val => {
            if(val instanceof NavigationEnd) {
                this.route = HomeComponent.getChildRoute(val.url);
            }
        });
    }

    private goToIntro() {
        this.router.navigateByUrl(Route.intro.base);
    }

    private goToAddAnotherDevice(): void {
        this.router.navigateByUrl(Route.addAnotherDevice);
    }

    /**
     * Redirect to appropriate page if the app is not initialized. This is done here asynchronously because it requires
     * calling Squid service, and we want to show the UI before that happens.
     */
    public ngOnInit(): Promise<void> {
        this.route = HomeComponent.getChildRoute(this.router.url);

        const thisDevice = this.settingsService.settings.thisDevice;
        if(!thisDevice) {
            this.goToIntro();
            return Promise.resolve();
        }

        return this.squidService.getDevices()
            .then(devices => {
                // If the current device is not registered, go to intro component
                if(!devices || !devices.find(device => device.id == thisDevice.id)) {
                    this.goToIntro();
                // Otherwise if no other device is registered (one without current ID), got to add another device component
                } else if(devices.every(device => device.id == thisDevice.id)) {
                    this.goToAddAnotherDevice();
                }
            });
    }

    private static getChildRoute(url: string) {
        const urlSections = url.split('/');
        if(!urlSections || urlSections.length == 0) {
            return undefined;
        }

        return urlSections[urlSections.length - 1];
    }
}