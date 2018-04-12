var clean = require('gulp-clean'),
    gulp = require('gulp'),
    gutil = require('gulp-util'),
    jeditor = require("gulp-json-editor"),
    ts = require("gulp-typescript"),
    tsProject = ts.createProject("tsconfig.json"),
    webpack = require('webpack-stream'),
    zip = require('gulp-zip');
    
var exec = require('child_process').exec;

// Set the version to be built. Defaults to 1.0.0.0 if there is no version
// e.g. --version 1.2.3.4
function getVersion() {
    var version = gutil.env.version;
    if(!version) {
        version = '1.0.0.0';
        console.warn('--version not passed. Using default version');
    }
    console.log(`Building version ${version}`);
    return version;
}
var version = getVersion();

gulp.task('default', ['copyResources', 'copyCompiledFiles', 'copyManifest', 'copyNodeModules', 'transpile']);

// Clean everything except the node_modules
gulp.task('clean', ['cleanBuild'], function(cb) {
    exec('git clean -fxd -e node_modules', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
});

// Clean the build folder
gulp.task('cleanBuild', function() {
    return gulp.src('./build')
        .pipe(clean());
});

// Build TypeScript
gulp.task('transpile', ['clean'], function() {
    return tsProject.src()
        .pipe(tsProject())
        .js.pipe(gulp.dest("./src"));
});

// Copies the TypeScript build's JS files
gulp.task('copyCompiledFiles', ['clean', 'transpile'], function() {
    var folders = ['src/**/*.js'];
    return gulp.src(folders, { base: '.' })
        .pipe(gulp.dest('./build'));
});

// Copies any files that don't need to be built
gulp.task('copyResources', ['clean'], function() {
    var files = [
        '*.html',
        'system.config.js',
        'systemjs-angular-loader.js',
        '*/**/bootstrap.js',
        'src/**/*.png',
        'src/**/*.svg',
        'src/**/*.css',
        'src/**/*.html'];
    return gulp.src(files, { base: '.' })
        .pipe(gulp.dest('./build'));
});

// Copies manifest.json and sets a version number
gulp.task('copyManifest', ['clean'], function() {
    return gulp.src('./manifest.json')
        .pipe(jeditor(function(json) {
            json.version = version;
            
            // Key is not needed when app is deployed to store
            delete json.key;

            // Localhost permission is not needed in store version
            var localhostIndex = json.permissions.indexOf('http://localhost/');
            if(localhostIndex !== -1) {
                json.permissions.splice(localhostIndex, 1);
            }

            return json;
        }))
        .pipe(gulp.dest('./build'));
});

// Copies node modules
gulp.task('copyNodeModules', ['copyRxjs', 'clean'], function() {
    var files = [
        '@angular/compiler/bundles/compiler.umd.js',
        '@angular/common/bundles/common.umd.js',
        '@angular/common/bundles/common-http.umd.js',
        '@angular/core/bundles/core.umd.js',
        '@angular/http/bundles/http.umd.js',
        '@angular/platform-browser/bundles/platform-browser.umd.js',
        '@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js',
        '@angular/router/bundles/router.umd.js',
        'angular2-uuid/index.js',
        'bootstrap/dist/css/bootstrap.min.css',
        'core-js/client/shim.min.js',
        'jquery/dist/jquery.min.js',
        'reflect-metadata/Reflect.js',
        'systemjs/dist/system.src.js',
        'tslib/tslib.js',
        'zone.js/dist/zone.js'];
    return gulp.src(files, { cwd: '**/node_modules/'})
        .pipe(gulp.dest('build'));
});

// Copies RxJS files.
// Currently only copies the files that are used by the application at runtime (a subset of all JS files).
gulp.task('copyRxjs', ['clean'], function() {
    var files = [
        '*.js',
        'observable/*.js',
        'operator/*.js',
        'operators/*.js',
        'add/observable/*.js',
        'add/operator/*.js',
        'scheduler/*.js',
        'symbol/*.js',
        'util/*.js'
    ];
    return gulp.src(files, { cwd: '**/node_modules/rxjs/'})
        .pipe(gulp.dest('build'));
});

gulp.task('zip', ['default'], function() {
    return gulp.src('./build/**/*')
        .pipe(zip(`squid-${version}.zip`))
        .pipe(gulp.dest('.'));
});

gulp.task('webpack', function() {
    return gulp.src('./src/areas/popup/main.js')
        .pipe(webpack(require('./webpack.config.js')))
        .pipe(gulp.dest('dist/'));
});