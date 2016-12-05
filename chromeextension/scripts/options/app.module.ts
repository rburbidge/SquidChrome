import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { DeviceService } from './services/device.service';

@NgModule({
    imports: [BrowserModule, HttpModule],
    declarations: [AppComponent],
    providers: [DeviceService],
    bootstrap: [AppComponent]
})
export class AppModule { }