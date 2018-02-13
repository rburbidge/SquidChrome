export class ChromeAuthHelper {
    /**
     * Creates an Authorization header for the user signed-in to Google Chrome. Signs the user in if they are signed out.
     */
    public static createAuthHeader(interactiveSignIn: boolean = false): Promise<string> {
        return new Promise((resolve, reject) => {
            chrome.identity.getAuthToken({ 'interactive': interactiveSignIn }, (token) => {
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
}