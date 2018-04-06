var clean = require('gulp-clean'),
    gulp = require('gulp'),
    jeditor = require("gulp-json-editor"),
    ts = require("gulp-typescript"),
    tsProject = ts.createProject("tsconfig.json"),
    zip = require('gulp-zip');
    
var exec = require('child_process').exec;

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
            json.version = '1.2.3.4';
            delete json.key;

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
    return gulp.src('build/**/*')
        .pipe(zip('archive.zip'))
        .pipe(gulp.dest('build'));
});

gulp.task('ziponly', function() {
    return gulp.src('./build/**/*')
        .pipe(zip('archive.zip'))
        .pipe(gulp.dest('build'));
});