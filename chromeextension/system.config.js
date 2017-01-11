(function (global) {
  SystemJS.defaultJSExtensions = true;
  System.config({
    paths: {
        // paths serve as alias
        'npm:': 'node_modules/'
    },
    // map tells the System loader where to look for things
    map: {
        // our app is within the app folder
        app: 'scripts',

        // angular bundles
        'angular2-uuid' : 'npm:angular2-uuid/index.js',
        '@angular/core': 'npm:@angular/core/bundles/core.umd.js',
        '@angular/common': 'npm:@angular/common/bundles/common.umd.js',
        '@angular/compiler': 'npm:@angular/compiler/bundles/compiler.umd.js',
        '@angular/platform-browser': 'npm:@angular/platform-browser/bundles/platform-browser.umd.js',
        '@angular/platform-browser-dynamic': 'npm:@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js',
        '@angular/http': 'npm:@angular/http/bundles/http.umd.js',
        '@angular/router': 'npm:@angular/router/bundles/router.umd.js',
        '@angular/forms': 'npm:@angular/forms/bundles/forms.umd.js',
        '@angular/upgrade': 'npm:@angular/upgrade/bundles/upgrade.umd.js',

        // other libraries
        'jquery': 'npm:jquery/dist/jquery.min.js',
        'rxjs': 'npm:rxjs',
        'angular-in-memory-web-api': 'npm:angular-in-memory-web-api/bundles/in-memory-web-api.umd.js'
    },
    meta: {
        'node_modules/jquery/dist/jquery.min.js': {
             format: 'amd',
             exports: '$'
        }
    },
    scripts: {
        format: 'register',
        defaultExtension: 'js'
    }
  });
})(this);
