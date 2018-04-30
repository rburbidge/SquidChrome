import { Component } from '@angular/core';

@Component({
    selector: 'my-app',
    template: `
        <router-outlet></router-outlet>
        <simple-notifications></simple-notifications>
    `
})
export class AppComponent {
}