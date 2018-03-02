import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AboutComponent } from './components/about/about.component';
import { AddAnotherDeviceComponent } from './components/add-another-device/add-another-device.component';
import { AddDeviceComponent } from './components/intro/add-device/add-device.component';
import { AppComponent } from './components/app/app.component';
import { AttributionComponent } from './components/about/attribution/attribution.component';
import { ChromeExtensionLinkDirective } from '../common/directives/chrome-ext/link/link.directive';
import { ChromeExtensionSourceDirective } from '../common/directives/chrome-ext-src.directive';
import { ChromeService } from './services/chrome.service';
import { DescriptionComponent } from './components/intro/description/description.component';
import { IntroBottomComponent } from './components/intro/intro-bottom/intro-bottom.component';
import { IntroComponent } from './components/intro/intro.component';
import { IsAppInitialized } from './routing/is-app-initialized';
import { DeveloperComponent } from './components/developer/developer.component';
import { DeviceService } from './services/device.service';
import { GcmService } from './services/gcm.service';
import { OptionsComponent } from './components/options/options.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { Route } from './routing/route';
import { SelectDeviceComponent } from './components/select-device/select-device.component';
import { SettingsService } from './services/settings.service';
import { SignedOutComponent } from './components/intro/signed-out/signed-out.component';
import { WindowService } from './services/window.service';
import { DeviceGridComponent } from './components/common/device-grid/device-grid.component';

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
                path: Route.about,
                component: AboutComponent
            },
            {
                path: Route.addAnotherDevice,
                component: AddAnotherDeviceComponent
            },
            {
                path: Route.developer,
                component: DeveloperComponent
            },
            {
                path: Route.options,
                component: OptionsComponent
            },
            {
                path: Route.intro.base,
                component: IntroComponent,
                children: [
                    { path: Route.intro.description, component: DescriptionComponent },
                    { path: Route.intro.signIn, component: SignedOutComponent },
                    { path: Route.intro.registerDevice, component: AddDeviceComponent}
                ]
            }
        ])
    ],
    declarations: [
        AppComponent,
        
        AboutComponent,
        AddAnotherDeviceComponent,
        AttributionComponent,
        DeveloperComponent,
        DeviceGridComponent,
        OptionsComponent,
        SelectDeviceComponent,
        ToolbarComponent,

        // Intro Components
        IntroComponent,
        IntroBottomComponent,
        AddDeviceComponent,
        DescriptionComponent,
        SignedOutComponent,

        // Directives
        ChromeExtensionLinkDirective,
        ChromeExtensionSourceDirective
    ],
    providers: [IsAppInitialized, ChromeService, GcmService, SettingsService, DeviceService, WindowService],
    bootstrap: [AppComponent]
})
export class AppModule { }