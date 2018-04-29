(function (global) {
  SystemJS.defaultJSExtensions = true;
  System.config({
    paths: {
        // paths serve as alias
        'npm:': 'node_modules/'
    },
    // map tells the System loader where to look for things
    map: {
        // our app is within the src folder
        app: 'src',

        // angular bundles
        'angular2-uuid' : 'npm:angular2-uuid/index.js',
        '@angular/core': 'npm:@angular/core/bundles/core.umd.js',
        '@angular/common': 'npm:@angular/common/bundles/common.umd.js',
        '@angular/common/http': 'npm:@angular/common/bundles/common-http.umd.js',
        '@angular/compiler': 'npm:@angular/compiler/bundles/compiler.umd.js',
        '@angular/platform-browser': 'npm:@angular/platform-browser/bundles/platform-browser.umd.js',
        '@angular/platform-browser-dynamic': 'npm:@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js',
        '@angular/router': 'npm:@angular/router/bundles/router.umd.js',
        '@angular/forms': 'npm:@angular/forms/bundles/forms.umd.js',
        '@angular/upgrade': 'npm:@angular/upgrade/bundles/upgrade.umd.js',
        '@angular/animations':'npm:@angular/animations/bundles/animations.umd.js',
        '@angular/animations/browser': 'npm:@angular/animations/bundles/animations-browser.umd.js',
        '@angular/platform-browser/animations': 'npm:@angular/platform-browser/bundles/platform-browser-animations.umd.js', 

        // other libraries
        'jquery': 'npm:jquery/dist/jquery.min.js',
        'rxjs': 'npm:rxjs',
        'tslib': 'npm:tslib/tslib.js',
        //'angular-in-memory-web-api': 'npm:angular-in-memory-web-api/bundles/in-memory-web-api.umd.js',
        'angular2-notifications': 'npm:angular2-notifications/angular2-notifications.umd.js'
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
    },
    packages: {
        app: {
            main: './main.js',
            defaultExtension: 'js',
            meta: {
                './*.js': {
                    loader: 'systemjs-angular-loader.js'
                }
            }
        },
        rxjs: {
            defaultExtension: 'js'
        },
        'angular2-notifications': { main: './index.js', defaultExtension: 'js' }
    }
  });
})(this);
