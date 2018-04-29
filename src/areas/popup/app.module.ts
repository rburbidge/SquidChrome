import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { enableProdMode, NgModule, APP_INITIALIZER } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AboutComponent } from './components/options/about/about.component';
import { AddAnotherDeviceComponent } from './components/add-another-device/add-another-device.component';
import { AddDeviceComponent } from './components/intro/add-device/add-device.component';
import { AppComponent } from './components/app/app.component';
import { AttributionComponent } from './components/options/about/attribution/attribution.component';
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
import { ManageDevicesComponent } from './components/options/manage-devices/manage-devices.component';
import { OptionsListComponent } from './components/options/options-list/options-list.component';
import { Strings } from '../../assets/strings/strings';
import { DeviceComponent } from './components/options/device/device.component';
import { SquidAuthInterceptor } from './services/squid/squid-auth.interceptor';
import { InstructionsComponent } from './components/options/instructions/instructions.component';

import { SimpleNotificationsModule } from 'angular2-notifications';

const strings = new Strings();

enableProdMode();

@NgModule({
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        SimpleNotificationsModule.forRoot(),
        RouterModule.forRoot([
            {
                path: '',
                component: SelectDeviceComponent,
                canActivate: [IsAppInitialized]
            },
            
            {
                path: Route.addAnotherDevice,
                component: AddAnotherDeviceComponent
            },

            {
                path: Route.options.base,
                component: OptionsComponent,
                data: { title: strings.options.title },
                children: [
                    { path: Route.options.about, component: AboutComponent, data: { title: strings.about.title } },
                    { path: Route.options.developer, component: DeveloperComponent, data: { title: strings.developer.title } },
                    { path: Route.options.instructions, component: InstructionsComponent, data: { title: strings.instructions.title } },
                    { path: Route.options.list, component: OptionsListComponent, data: { title: strings.options.title } },
                    { path: Route.options.manageDevices, component: ManageDevicesComponent, data: { title: strings.manageDevices.title } },
                    { path: Route.options.manageDevice, component: DeviceComponent },
                ]
            },
            {
                path: Route.intro.base,
                component: IntroComponent,
                children: [
                    { path: Route.intro.description, component: DescriptionComponent },
                    { path: Route.intro.signIn, component: SignedOutComponent },
                    { path: Route.intro.registerDevice, component: AddDeviceComponent }
                ]
            }
        ])
    ],
    declarations: [
        AppComponent,
        
        // Components
        AddAnotherDeviceComponent,
        SelectDeviceComponent,

        // Intro components
        AddDeviceComponent,
        DescriptionComponent,
        IntroComponent,
        IntroBottomComponent,
        SignedOutComponent,

        // Options components
        AttributionComponent,
        AboutComponent,
        DeveloperComponent,
        DeviceComponent,
        InstructionsComponent,
        ManageDevicesComponent,
        OptionsComponent,
        OptionsListComponent,

        // Directives
        ChromeExtensionLinkDirective,
        ChromeExtensionSourceDirective,

        // Common components
        DeviceGridComponent,
        ToolbarComponent,
    ],
    providers: [
        // Guards
        IsAppInitialized,

        // Services
        ChromeService,
        GcmService,
        DeviceService,
        SettingsService,
        WindowService,

        {
            provide: HTTP_INTERCEPTORS,
            useClass: SquidAuthInterceptor,
            multi: true,
            deps: [ChromeService]
        },

        {
            provide: APP_INITIALIZER,
            useFactory: (settingsService) => () => settingsService.init(),
            multi: true,
            deps: [SettingsService]
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }