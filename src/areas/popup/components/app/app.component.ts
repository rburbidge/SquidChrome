import { Component } from '@angular/core';

@Component({
    selector: 'my-app',
    template: `
        <router-outlet></router-outlet>
        <simple-notifications [options]="notificationOptions"></simple-notifications>
    `
})
export class AppComponent {
    public notificationOptions = {
        clickToClose: true,
        position: ["bottom", "center"],
        animate: 'fromBottom'
    };
}