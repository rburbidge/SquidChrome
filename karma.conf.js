module.exports = function(config) {
  var scriptsBase = 'src/'; // transpiled src

  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter')
    ],

    client: {
      builtPaths: [scriptsBase], // add more spec base paths as needed
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },

    customLaunchers: {
      // From the CLI. Not used here but interesting
      // chrome setup for travis CI using chromium
      Chrome_travis_ci: {
        base: 'Chrome',
        flags: ['--no-sandbox']
      }
    },

    files: [
      // System.js for module loading
      'node_modules/systemjs/dist/system.src.js',

      // Polyfills
      'node_modules/core-js/client/shim.js',

      // zone.js
      'node_modules/zone.js/dist/zone.js',
      'node_modules/zone.js/dist/long-stack-trace-zone.js',
      'node_modules/zone.js/dist/proxy.js',
      'node_modules/zone.js/dist/sync-test.js',
      'node_modules/zone.js/dist/jasmine-patch.js',
      'node_modules/zone.js/dist/async-test.js',
      'node_modules/zone.js/dist/fake-async-test.js',

      'node_modules/tslib/tslib.js',
      
      // Squid-specific files
      'node_modules/bootstrap/dist/css/bootstrap.min.css',
      'node_modules/jquery/dist/jquery.min.js',

      // RxJs
      { pattern: 'node_modules/rxjs/**/*.js', included: false, watched: false },
      { pattern: 'node_modules/rxjs/**/*.js.map', included: false, watched: false },

      // Paths loaded via module imports:
      // Angular itself
      { pattern: 'node_modules/@angular/**/*.js', included: false, watched: false },
      { pattern: 'node_modules/@angular/**/*.js.map', included: false, watched: false },

      { pattern: 'node_modules/angular2-uuid/**/*.js', included: false, watched: false },
      { pattern: 'node_modules/angular2-notifications/**/*.js', included: false, watched: false },

      { pattern: 'system.config.js', included: false, watched: false },
      //{ pattern: 'system.config.extras.js', included: false, watched: false },
      { pattern: 'systemjs-angular-loader.js', included: false, watched: false },
      'karma-test-shim.js',

      { pattern: scriptsBase + '**/*.ts', included: false, watched: false },
      { pattern: scriptsBase + '**/*.js', included: false, watched: true },
      { pattern: scriptsBase + '**/*.js.map', included: false, watched: false },
      { pattern: scriptsBase + '**/*.html', included: false, watched: false },
      { pattern: scriptsBase + '**/*.css', included: false, watched: false },
    ],

    // Proxied base paths for loading assets
    proxies: {
      // required for modules fetched by SystemJS
      '/base/src/node_modules/': '/base/node_modules/'
    },

    exclude: [],
    preprocessors: {},
    reporters: ['progress', 'kjhtml'],

    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false
  })
}
