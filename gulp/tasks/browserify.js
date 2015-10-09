var gulp = require('gulp');
var gutil = require('gulp-util');
var uglify = require('gulp-uglify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var rev = require('gulp-rev');
var watchify = require('watchify');
var connect = require('gulp-connect');
var config = require('../config').browserify;

watchify.args.debug = config.debug;
var bundler = watchify(browserify(config.src, watchify.args));
config.settings.transform.forEach(function(t) {
  bundler.transform(t);
});

var arr;
if (!config.debug) {
  arr = ['clean'];
}

gulp.task('browserify', arr, bundle);
bundler.on('update', bundle);

function bundle() {
  if (config.debug) {
    return bundler.bundle()
    // log errors if they happen
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(source(config.outputName))
    .pipe(gulp.dest(config.dest))
    .pipe(connect.reload());
  } else {
    return bundler.bundle()
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(source(config.outputName))
    .pipe(buffer())
    .pipe(uglify()) 
    .pipe(buffer())
    .pipe(rev())
    .pipe(gulp.dest(config.dest))
    .pipe(rev.manifest())
    .pipe(gulp.dest(config.dest))
    .pipe(connect.reload());
  }
}
