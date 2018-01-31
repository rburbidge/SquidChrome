import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AddDeviceComponent } from './components/add-device/add-device.component';
import { AppComponent } from './components/app/app.component';
import { CanActivateApp } from './routing/can-activate';
import { ChromeService } from './services/chrome.service';
import { DeveloperComponent } from './components/developer/developer.component';
import { DeviceService } from './services/device.service';
import { GcmService } from './services/gcm.service';
import { OptionsComponent } from './components/options/options.component';
import { Route } from './route';
import { SettingsService } from './services/settings.service';
import { SignedOutComponent } from './components/signed-out/signed-out.component';
import { WindowService } from './services/window.service';

@NgModule({
    imports: [
        BrowserModule,
        HttpModule,
        RouterModule.forRoot([
            {
                path: '',
                component: OptionsComponent,
                canActivate: [CanActivateApp]
            },
            {
                path: Route.addDevice,
                component: AddDeviceComponent
            },
            {
                path: Route.signedOut,
                component: SignedOutComponent
            }
        ])
    ],
    declarations: [AddDeviceComponent, AppComponent, DeveloperComponent, OptionsComponent, SignedOutComponent],
    providers: [CanActivateApp, ChromeService, GcmService, SettingsService, DeviceService, WindowService],
    bootstrap: [AppComponent]
})
export class AppModule { }