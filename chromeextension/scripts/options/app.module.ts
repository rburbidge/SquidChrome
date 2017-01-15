import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { NgModule } from '@angular/core';

import { OptionsComponent } from './options.component';
import { ChromeStorageService } from './services/chrome-storage.service';
import { DeviceService } from './services/device.service';

@NgModule({
    imports: [BrowserModule, HttpModule],
    declarations: [OptionsComponent],
    providers: [ChromeStorageService, DeviceService],
    bootstrap: [OptionsComponent]
})
export class AppModule { }