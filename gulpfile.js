var gulp = require('gulp'),
    ts = require("gulp-typescript"),
    tsProject = ts.createProject("tsconfig.json"),
    zip = require('gulp-zip');

var exec = require('child_process').exec;

gulp.task('default', ['copyResources', 'copyCompiledFiles', 'copyNodeModules', 'copyRxjs', 'transpile']);

// Clean everything except the node_modules
gulp.task('clean', function(cb) {
    exec('git clean -fxd -e node_modules', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
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
        'manifest.json',
        'system.config.js',
        'systemjs-angular-loader.js',
        'bootstrap/**/*',
        'icons/**/*',
        'lib/**/*',
        'src/**/*.css',
        'src/**/*.html',
        'templates/**/*'];
    return gulp.src(files, { base: '.' })
        .pipe(gulp.dest('./build'));
});

// Copies node modules
gulp.task('copyNodeModules', ['clean'], function() {
    var files = [
        '@angular/compiler/bundles/compiler.umd.js',
        '@angular/common/bundles/common.umd.js',
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