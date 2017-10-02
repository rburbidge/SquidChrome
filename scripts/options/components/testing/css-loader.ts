import $ from 'jquery';

/** Add styles to the page so that we can see what each test would look like in production. */
export function loadCss() {
    $('body').append(
        `<link rel="stylesheet" href="/base/scripts/css/squid.css" />
         <link rel="stylesheet" href="/base/scripts/css/lib/material-3.0.2.css" />
         <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
         <link rel="stylesheet" href="/base/node_modules/bootstrap/dist/css/bootstrap.min.css" />`);
}