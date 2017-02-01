var gulp = require('gulp'),
    del = require('del'),
    ts = require("gulp-typescript"),
    tsProject = ts.createProject("tsconfig.json"),
    zip = require('gulp-zip');

var exec = require('child_process').exec;

gulp.task('default', ['copyResources', 'copyCompiledFiles', 'copyNodeModules', 'copyRxjs', 'transpile']);

// Clean the build folder
gulp.task('cleanBuild', function() {
    return del('build/*');
});

// Clean everything except the build and node_modules directories
gulp.task('clean', ['cleanBuild'], function(cb) {
    exec('git clean -fxd -e node_modules -e build', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
});

// Build TypeScript
gulp.task('transpile', ['clean', 'cleanBuild'], function() {
    return tsProject.src()
        .pipe(tsProject())
        .js.pipe(gulp.dest("."));
});

// Copies any files that don't need to be built
gulp.task('copyResources', ['cleanBuild'], function() {
    var files = [
        '*.png', 
        '*.html',
        'manifest.json',
        'system.config.js',
        'bootstrap/**/*',
        'css/**/*',
        'lib/**/*',
        'templates/**/*'];
    return gulp.src(files, { base: '.' })
        .pipe(gulp.dest('./build'));
});

// Copies node modules
gulp.task('copyNodeModules', ['cleanBuild'], function() {
    var files = [
        '@angular/compiler/bundles/compiler.umd.js',
        '@angular/common/bundles/common.umd.js',
        '@angular/core/bundles/core.umd.js',
        '@angular/http/bundles/http.umd.js',
        '@angular/platform-browser/bundles/platform-browser.umd.js',
        '@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js',
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
gulp.task('copyRxjs', ['cleanBuild'], function() {
    var files = [
        '*.js',
        'observable/*.js',
        'operator/*.js',
        'add/observable/*.js',
        'add/operator/*.js',
        'scheduler/*.js',
        'symbol/*.js',
        'util/*.js'
    ];
    return gulp.src(files, { cwd: '**/node_modules/rxjs/'})
        .pipe(gulp.dest('build'));
});

// Copies the TypeScript build's JS files
gulp.task('copyCompiledFiles', ['cleanBuild', 'transpile'], function() {
    var folders = ['scripts/**/*.js'];
    return gulp.src(folders, { base: '.' })
        .pipe(gulp.dest('./build'));
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