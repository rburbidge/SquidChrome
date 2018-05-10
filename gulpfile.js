var clean = require('gulp-clean'),
    gulp = require('gulp'),
    gutil = require('gulp-util'),
    jeditor = require("gulp-json-editor"),
    ts = require("gulp-typescript"),
    tsProject = ts.createProject("tsconfig.json"),
    webpack = require('webpack'),
    webpackStream = require('webpack-stream'),
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
gulp.task('copyManifest', function() {
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
gulp.task('copyNodeModules2', function() {
    var files = [
        'applicationinsights-js/dist/ai.js',
        'bootstrap/dist/css/bootstrap.min.css',
        'core-js/client/shim.min.js',
        'jquery/dist/jquery.min.js',
        'reflect-metadata/Reflect.js',
        'zone.js/dist/zone.js'
    ];
    return gulp.src(files, { cwd: '**/node_modules/'})
        .pipe(gulp.dest('build'));
});

// Copies any files that don't need to be built
gulp.task('copyResources2', function() {
    var files = [
        'src/assets/**/*',
        'popup.html'
    ];
    return gulp.src(files, { base: '.' })
        .pipe(gulp.dest('./build'));
});

gulp.task('webpack', function() {
    return gulp.src('./src/areas/popup/main.js')
        .pipe(webpackStream(require('./webpack.prod.js'), webpack))
        .pipe(gulp.dest('build/scripts'));
});

gulp.task('build2', ['webpack', 'copyManifest', 'copyResources2', 'copyNodeModules2'])

gulp.task('zip2', ['build2'], function() {
    return gulp.src('./build/**/*')
        .pipe(zip(`squid-${version}.zip`))
        .pipe(gulp.dest('.'));
});