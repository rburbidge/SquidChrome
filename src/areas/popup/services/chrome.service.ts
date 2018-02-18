import { Injectable } from '@angular/core';
import { ChromeAuthHelper } from '../../common/chrome-auth-helper';
import { optionsPageName } from '../../common/url-helper';

@Injectable()
export class ChromeService {
    /**
     * Returns the options URL of the app.
     */
    public getOptionsUrl(): string {
        return chrome.runtime.getURL(optionsPageName);
    }

    /**
     * Returns the current tab URL.
     */
    public getCurrentTabUrl(): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            var queryInfo = {
                active: true,
                currentWindow: true
            };

            chrome.tabs.query(queryInfo, function(tabs) {
                // Can safely assume that at least one tab is open
                resolve(tabs[0].url);
            });
        });
    }

    /**
     * Opens a new tab to a given URL.
     */
    public openTab(url: string): void {
        chrome.tabs.create({ url: url });
    }

    /**
     * Returns true if the extension was installed from an unpacked folder, rather than from a .crx file.
     */
    public isDevMode(): boolean {
        return !('update_url' in chrome.runtime.getManifest());
    }

    /**
     * Signs the user into chrome in interactive mode.
     * 
     * Chrome sign-in is an indeterminate process. If the user successfully logs in, then this will return true. However,
     * if the user never logs in, then the Promise will never evaluate. If the log in fails due to a config/permission
     * issue, then it will return false.
     * @returns True iff the sign in succeeded, or was already signed in.
     */
    public signIntoChrome(): Promise<boolean> {
        return ChromeAuthHelper.createAuthHeader(true)
            .then(authHeader => !!authHeader)
            .catch(reason => false);
    }

    /**
     * Returns whether or not the user is signed into Chrome.
     */
    public isSignedIntoChrome(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            chrome.identity.getProfileUserInfo(userInfo => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                    return;
                }

                // From the documentation (https://developer.chrome.com/apps/identity#method-getProfileUserInfo)
                // user.email is an empty string if either the user is not signed into Chrome or the application didn't
                // specify the "identity.email" manifest permission
                resolve(!!(userInfo && userInfo.email && userInfo.email != ""));
            });
        });
    }
}