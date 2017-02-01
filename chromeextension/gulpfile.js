var gulp = require('gulp'),
    del = require('del'),
    ts = require("gulp-typescript"),
    tsProject = ts.createProject("tsconfig.json"),
    zip = require('gulp-zip');

var exec = require('child_process').exec;

// Clean the build folder
gulp.task('cleanbuild', function() {
    return del('build/*');
});

// Clean everything except the build and node_modules directory
gulp.task('clean', ['cleanbuild'], function(cb) {
    exec('git clean -fxd -e node_modules -e build', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
});

// Build TypeScript
gulp.task('transpile', ['clean', 'cleanbuild'], function() {
    return tsProject.src()
        .pipe(tsProject())
        .js.pipe(gulp.dest("."));
});

// Copy to the ./build folder
gulp.task('build', ['transpile'], function() {

    // TODO Fix this to return the result of ALL of the copying completing, not just these files
    // Copy top-level files
    var complete = gulp.src([
        '*.png', 
        '*.html',
        'manifest.json',
        'system.config.js'])
        .pipe(gulp.dest('./build'));

    // Copy entire folders
    var folders = ['bootstrap', 'css', 'lib', 'scripts', 'templates'];
    for(var i = 0; i < folders.length; i++) {
        var folder = folders[i];
        gulp.src([`./${folder}/**/*`])
            .pipe(gulp.dest(`./build/${folder}`));
    }

    // Copy node module files
    var nodeFiles = [
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
    for(var i = 0; i < nodeFiles.length; i++) {
        var originalFile = 'node_modules/' + nodeFiles[i];
        var endOfPath = originalFile.lastIndexOf('/');

        var dir = originalFile.substr(0, endOfPath);
        var fileName = originalFile.substr(endOfPath, originalFile.length - endOfPath);

        gulp.src(originalFile)
            .pipe(gulp.dest('./build/' + dir));
    }
    
    // Copy RxJS *.js files
    var rxjs = [
        '',
        'operator/',
        'observable/',
        'add/operator/',
        'add/observable/',
        'scheduler/',
        'symbol/',
        'util/'
    ];
    for(var i = 0; i < rxjs.length; i++) {
        var folder = 'node_modules/rxjs/' + rxjs[i];
        gulp.src(folder + '*.js')
            .pipe(gulp.dest('./build/' + folder));
    }

    return complete;
});

gulp.task('zip', ['build'], function() {
    return gulp.src('./build/**/*')
        .pipe(zip('archive.zip'))
        .pipe(gulp.dest('./build'));
});

gulp.task('ziponly', function() {
    return gulp.src('./build/**/*')
        .pipe(zip('archive.zip'))
        .pipe(gulp.dest('./build'));
});