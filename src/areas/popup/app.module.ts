import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { enableProdMode, NgModule, APP_INITIALIZER, ErrorHandler } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { APP_BASE_HREF } from '@angular/common';

import { AddAnotherDeviceComponent } from './components/add-another-device/add-another-device.component';
import { AddDeviceComponent } from './components/intro/add-device/add-device.component';
import { AppComponent } from './components/app/app.component';
import { ChromeExtensionSourceDirective } from '../common/directives/chrome-ext-src.directive';
import { ChromeService } from './services/chrome.service';
import { DescriptionComponent } from './components/intro/description/description.component';
import { IntroBottomComponent } from './components/intro/intro-bottom/intro-bottom.component';
import { IntroComponent } from './components/intro/intro.component';
import { IsAppInitialized } from './routing/is-app-initialized';
import { DeveloperComponent } from './components/developer/developer.component';
import { SquidService } from './services/squid.service';
import { GcmService } from './services/gcm.service';
import { OptionsComponent } from './components/options/options.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { Route } from './routing/route';
import { SettingsService } from './services/settings.service';
import { SignedOutComponent } from './components/intro/signed-out/signed-out.component';
import { WindowService } from './services/window.service';
import { DeviceGridComponent } from './components/common/device-grid/device-grid.component';
import { ManageDevicesComponent } from './components/options/manage-devices/manage-devices.component';
import { OptionsListComponent } from './components/options/options-list/options-list.component';
import { Strings } from '../../assets/strings/strings';
import { DeviceComponent } from './components/options/device/device.component';
import { SquidAuthInterceptor } from './services/squid/squid-auth.interceptor';
import { IFrameComponent } from './components/common/iframe/iframe.component';
import { GlobalErrorHandler } from './global-error-handler';
import { TelemetryService } from './services/telemetry.service';
import { HomeComponent } from './components/home/home.component';
import { HistoryComponent } from './components/home/history/history.component';
import { ShareComponent } from './components/home/share/share.component';

const strings = new Strings();

enableProdMode();

@NgModule({
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        SimpleNotificationsModule.forRoot({
            clickToClose: true,
            position: ['bottom', 'center'],
            animate: 'fromBottom',
            timeOut: 3000
        }),
        RouterModule.forRoot([
            {
                path: 'home',
                component: HomeComponent,
                children: [
                    { path: Route.home.share, component: ShareComponent },
                    { path: Route.home.history, component: HistoryComponent },
                    { path: Route.home.devices, component: DeviceGridComponent },
                ]
            },
            
            // Redirect the initial popup.html to the home HistoryComponent
            {
                path: 'popup.html',
                redirectTo: Route.home.base + '/' + Route.home.history,
                pathMatch: 'full'
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
                    { path: Route.options.about, component: IFrameComponent, data: { title: strings.about.title, squidPath: '/squid/about' } },
                    { path: Route.options.developer, component: DeveloperComponent, data: { title: strings.developer.title } },
                    { path: Route.options.instructions, component: IFrameComponent, data: { title: strings.instructions.title, squidPath: '/squid/instructions' }, },
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
        HomeComponent,
        HistoryComponent,
        ShareComponent,
        AddAnotherDeviceComponent,

        // Intro components
        AddDeviceComponent,
        DescriptionComponent,
        IntroComponent,
        IntroBottomComponent,
        SignedOutComponent,

        // Options components
        DeveloperComponent,
        DeviceComponent,
        ManageDevicesComponent,
        OptionsComponent,
        OptionsListComponent,

        // Directives
        ChromeExtensionSourceDirective,

        // Common components
        DeviceGridComponent,
        ToolbarComponent,
        IFrameComponent,
    ],
    providers: [
        // Guards
        IsAppInitialized,

        // Services
        ChromeService,
        GcmService,
        SquidService,
        SettingsService,
        TelemetryService,
        WindowService,

        {
            provide: ErrorHandler,
            useClass: GlobalErrorHandler
        },
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
        },
        {
            provide: APP_INITIALIZER,
            useFactory: (telemetryService) => () => telemetryService.init(),
            multi: true,
            deps: [TelemetryService]
        },
        {
            provide: APP_BASE_HREF,
            useValue: '/'
        },
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }