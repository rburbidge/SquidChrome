import { ChromeService } from '../../services/chrome.service';
import { ChromeAuthHelper } from '../../../common/chrome-auth-helper';
import { Component } from '@angular/core';
import { Strings } from '../../../../assets/strings/strings';
import { UrlHelper } from '../../../common/url-helper';

/**
 * Tells the user that they need to sign into Google Chrome to use the app, and shows a sign-in button.
 */
@Component({
    selector: 'signed-out',
    templateUrl: './signed-out.html'
})
export class SignedOutComponent {

    public readonly strings: Strings = new Strings();

    constructor(private readonly chromeService: ChromeService) { }

    /** Sign the user in. Once the user is signed in, open the options page. */
    public signIn(): Promise<void> {
        return this.chromeService.signIntoChrome()
            .then((signedIn: boolean) => {
                UrlHelper.openOptionsPage();
            });
    }
}