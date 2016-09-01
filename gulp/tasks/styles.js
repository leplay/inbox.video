var gulp = require('gulp');
var sass = require('gulp-sass');
var rev = require('gulp-rev');
var clean = require('gulp-clean');
var cdnizer = require("gulp-cdnizer");
var connect = require('gulp-connect');
var config = require('../config.js').sass;

var arr = [];

if (!config.debug) {
  arr = ['clean'];
}

gulp.task('styles', arr, function() {
  if (config.debug) {
    gulp.src(config.src)
      .pipe(sass(config.settings).on('error', sass.logError))
      .pipe(gulp.dest(config.dest))
      .pipe(connect.reload());
  } else {
    gulp.src(config.src)
      .pipe(sass(config.settings).on('error', sass.logError))
      // .pipe(cdnizer({
      //     defaultCDNBase: config.cdn,
      //     relativeRoot: 'styles/',
      //     files: ['**/*.{gif,png,jpg,jpeg}']
      // }))
      .pipe(rev())
      .pipe(gulp.dest(config.dest))
      .pipe(rev.manifest())
      .pipe(gulp.dest(config.dest));
  }
});
