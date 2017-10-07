# manifest.json documentation
Comments are not supported in a Chrome extension's manifest.json, so this file serves as documentation for various fields.

```
{
  // This value gives the extension a unique ID during the development phase. https://developer.chrome.com/apps/manifest/key
  "key": "",
  
  "permissions": [
    "identity", // Required to get access tokens. See https://developer.chrome.com/apps/app_identity
  ],

  // These are required for an Angular 2 application within a Chrome extension
  // See https://www.sitepoint.com/chrome-extension-angular-2
  "content_security_policy": "script-src 'self' 'unsafe-eval'; object-src 'self'",

  "oauth2": {
    
    // This ID must be checked into the Chrome extension.
    // See https://developer.chrome.com/apps/app_identity
    // See https://stackoverflow.com/a/11829600/3339997 -- it is not possible to keep this value a secret.
    "client_id": "670316986609-htl91dqi7i612v3mq46tfu503u6gfi6d.apps.googleusercontent.com",
  },
}
```