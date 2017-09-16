export class ChromeAuthHelper {
    /**
     * Creates an Authorization header for the user signed-in to Google Chrome. Signs the user in if they are signed out.
     */
    public static createAuthHeader(): Promise<string> {
        return new Promise((resolve, reject) => {
            chrome.identity.getAuthToken({ 'interactive': true }, (token) => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                    return;
                }

                // Header prefixes are one of the following:
                // 'Bearer Google OAuth Access Token='
                // 'Bearer Google OAuth ID Token='
                // See http://stackoverflow.com/questions/8311836/how-to-identify-a-google-oauth2-user/13016081#13016081
                // for details on access vs. ID tokens
                resolve(`Bearer Google OAuth Access Token=${token}`);
            });
        })
    }

    /**
     * Signs the user into chrome in interactive mode.
     * 
     * Chrome sign-in is an indeterminate process. If the user successfully logs in, then this will return true. However,
     * if the user never logs in, then the Promise will never evaluate. If the log in fails due to a config/permission
     * issue, then it will return false.
     * @returns True iff the sign in succeeded, or was already signed in.
     */
    public static signIntoChrome(): Promise<boolean> {
        return ChromeAuthHelper.createAuthHeader()
            .then(authHeader => !!authHeader)
            .catch(reason => false);
    }

    /**
     * Returns whether or not the user is signed into Chrome.
     */
    public static isSignedIntoChrome(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            chrome.identity.getProfileUserInfo(userInfo => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                    return;
                }

                // From the documentation (https://developer.chrome.com/apps/identity#method-getProfileUserInfo)
                // user.email is an empty string if either the user is not signed into Chrome or the application didn't
                // specify the "identity.email" manifest permission
                resolve(userInfo && userInfo.email && userInfo.email != "");
            });
        });
    }
}