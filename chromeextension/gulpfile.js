var gulp = require('gulp'),
    del = require('del'),
    zip = require('gulp-zip');

var exec = require('child_process').exec;

gulp.task('clean', function(cb) {
    exec('git clean -fxd', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
});

gulp.task('install', function(cb) {
    exec('npm install', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
});

gulp.task('cleanbuild', function() {
    return del('build/*');
});

gulp.task('copy', ['cleanbuild'], function() {

    var thing = gulp.src([
        '*.png', 
        '*.html',
        'manifest.json',
        'system.config.js',
        './node_modules/bootstrap/dist/css/bootstrap.min.css'])
        .pipe(gulp.dest('./build'));

    var folders = ['bootstrap', 'css', 'lib', 'scripts', 'templates'];
    for(var i = 0; i < folders.length; i++) {
        var folder = folders[i];
        gulp.src([`./${folder}/**/*`])
            .pipe(gulp.dest(`./build/${folder}`));
    }

    return thing;
});

gulp.task('zip', ['copy'], function() {
    return gulp.src('./build/**/*')
        .pipe(zip('archive.zip'))
        .pipe(gulp.dest('./build'));
});

gulp.task('ziponly', function() {
    return gulp.src('./build/**/*')
        .pipe(zip('archive.zip'))
        .pipe(gulp.dest('./build'));
});