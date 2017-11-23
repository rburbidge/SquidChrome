import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppComponent } from './components/app/app.component';
import { ChromeService } from './services/chrome.service';
import { DeveloperComponent } from './components/developer/developer.component';
import { DeviceService } from './services/device.service';
import { OptionsComponent } from './components/options/options.component';
import { Route } from './route';
import { SettingsService } from './services/settings.service';
import { SignedOutComponent } from './components/signed-out/signed-out.component';

@NgModule({
    imports: [
        BrowserModule,
        HttpModule,
        RouterModule.forRoot([
            {
                path: '',
                component: OptionsComponent
            },
            {
                path: Route.signedOut,
                component: SignedOutComponent
            }
        ])
    ],
    declarations: [AppComponent, DeveloperComponent, OptionsComponent, SignedOutComponent],
    providers: [ChromeService, SettingsService, DeviceService],
    bootstrap: [AppComponent]
})
export class AppModule { }