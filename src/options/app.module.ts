import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AddDeviceComponent } from './components/add-device/add-device.component';
import { AppComponent } from './components/app/app.component';
import { ChromeService } from './services/chrome.service';
import { DeviceService } from './services/device.service';
import { GcmService } from './services/gcm.service';
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
                path: Route.addDevice,
                component: AddDeviceComponent
            },
            {
                path: Route.signedOut,
                component: SignedOutComponent
            }
        ])
    ],
    declarations: [AddDeviceComponent, AppComponent, OptionsComponent, SignedOutComponent],
    providers: [ChromeService, GcmService, SettingsService, DeviceService],
    bootstrap: [AppComponent]
})
export class AppModule { }