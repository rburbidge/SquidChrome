import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AddDeviceComponent } from './components/add-device/add-device.component';
import { AppComponent } from './components/app/app.component';
import { IsAppInitialized } from './routing/is-app-initialized';
import { ChromeService } from './services/chrome.service';
import { DeveloperComponent } from './components/developer/developer.component';
import { DeviceService } from './services/device.service';
import { GcmService } from './services/gcm.service';
import { Route } from './routing/route';
import { SelectDeviceComponent } from './components/select-device/select-device.component';
import { SettingsService } from './services/settings.service';
import { SignedOutComponent } from './components/signed-out/signed-out.component';
import { WindowService } from './services/window.service';
import { IntroComponent } from './components/intro/intro.component';
import { DescriptionComponent } from './components/intro/description/description.component';
import { ChromeExtensionSourceDirective } from '../common/directives/chrome-ext-src.directive';

@NgModule({
    imports: [
        BrowserModule,
        HttpModule,
        RouterModule.forRoot([
            {
                path: '',
                component: SelectDeviceComponent
            },
            {
                path: Route.intro,
                component: IntroComponent,
                children: [
                    { path: '', component: DescriptionComponent },
                    { path: 'signIn', component: SignedOutComponent },
                    { path: 'addDevice', component: AddDeviceComponent}
                ]
            }
        ])
    ],
    declarations: [
        AppComponent,
        
        DeveloperComponent,
        SelectDeviceComponent,

        // Intro Components
        IntroComponent,
        AddDeviceComponent,
        DescriptionComponent,
        SignedOutComponent,

        // Directives
        ChromeExtensionSourceDirective,
    ],
    providers: [IsAppInitialized, ChromeService, GcmService, SettingsService, DeviceService, WindowService],
    bootstrap: [AppComponent]
})
export class AppModule { }