import * as $ from 'jquery';

/**
 * Add styles to the page so that we can see what each test would look like in production.
 * @param styleUrls Set of CSS files to load. Must be relative to /src folder.
 */
export function loadCss(styleUrls?: string[]) {
    // Load default CSS
    $('body').append(
        `<link rel="stylesheet" href="/base/src/assets/css/squid.css" />
         <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
         <link rel="stylesheet" href="/base/node_modules/bootstrap/dist/css/bootstrap.min.css"/>`);

    // Load input CSS
    if(styleUrls) {
        for(let styleUrl of styleUrls) {
            $('body').append(`<link rel="stylesheet" href="/base/src/${styleUrl}" />`);
        }
    }
}