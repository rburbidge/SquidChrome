import { ChromeAuthHelper } from '../../../common/chrome-auth-helper';
import { Component } from '@angular/core';
import { UrlHelper } from '../../../common/url-helper';

@Component({
    selector: 'signed-out',
    templateUrl: './scripts/options/components/signed-out/signed-out.html'
})
export class SignedOutComponent {

    /** Sign the user in. Once the user is signed in, open the options page. */
    public signIn(): Promise<void> {
        return ChromeAuthHelper.signIntoChrome()
            .then((signedIn: boolean) => {
                UrlHelper.openOptionsPage();
            });
    }
}