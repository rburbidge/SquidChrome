import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppComponent } from './components/app/app.component';
import { OptionsComponent } from './components/options/options.component';
import { SignedOutComponent } from './components/signed-out/signed-out.component';
import { ChromeService } from './services/chrome.service';
import { ChromeStorageService } from './services/chrome-storage.service';
import { DeviceService } from './services/device.service';
import { Route } from './route';

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
    declarations: [AppComponent, OptionsComponent, SignedOutComponent],
    providers: [ChromeService, ChromeStorageService, DeviceService],
    bootstrap: [AppComponent]
})
export class AppModule { }