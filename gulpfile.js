const clean = require('gulp-clean');
const gulp = require('gulp');
const gutil = require('gulp-util');
const jeditor = require("gulp-json-editor");
const ts = require("gulp-typescript");
const tsProject = ts.createProject("tsconfig.json");
const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const zip = require('gulp-zip');
const runSequence = require('run-sequence');
    
const exec = require('child_process').exec;

const config = {
    buildDir: 'build',
    buildScriptsDir: 'build/scripts',
    resources: [
        'src/assets/**/*',
        'popup.html'
    ],
    manifest: './manifest.json'
};

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
    return gulp.src(config.buildDir)
        .pipe(clean());
});

// Copies the raw manifest.json
gulp.task('copyManifest:dev', function() {
    return gulp.src(config.manifest)
        .pipe(gulp.dest(config.buildDir));
});

// Copies manifest.json and sets a version number
gulp.task('copyManifest:prod', function() {
    return gulp.src(config.manifest)
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
        .pipe(gulp.dest(config.buildDir));
});

// Copies node modules
gulp.task('copyNodeModules', function() {
    var files = [
        'applicationinsights-js/dist/ai.js',
        'bootstrap/dist/css/bootstrap.min.css',
        'jquery/dist/jquery.min.js',
        'reflect-metadata/Reflect.js',
        'zone.js/dist/zone.js'
    ];
    return gulp.src(files, { cwd: '**/node_modules/'})
        .pipe(gulp.dest(config.buildDir));
});

// Copies any files that don't need to be built
gulp.task('copyResources', function() {
    return gulp.src(config.resources, { base: '.' })
        .pipe(gulp.dest(config.buildDir));
});

gulp.task('copyResources:watch', function() {
    return gulp.watch(config.resources, ['copyResources']);
});

gulp.task('webpack', function() {
    return gulp.src('./src/areas/popup/main.js')
        .pipe(webpackStream(require('./webpack.prod.js'), webpack))
        .pipe(gulp.dest(config.buildScriptsDir));
});

gulp.task('build:common', ['copyResources', 'copyNodeModules']);

gulp.task('build:dev', function(callback) {
    return runSequence('cleanBuild', ['webpack', 'copyManifest:dev', 'build:common'], callback);
});

gulp.task('build:prod', function(callback) {
    return runSequence('cleanBuild', ['webpack', 'copyManifest:prod', 'build:common'], callback);
});

gulp.task('zip', ['build:prod'], function() {
    return gulp.src('./build/**/*')
        .pipe(zip(`squid-${version}.zip`))
        .pipe(gulp.dest('.'));
});