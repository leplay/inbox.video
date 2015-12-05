var gulp = require('gulp');
var connect = require('gulp-connect');
var config = require('../config').watch;

var arr = ['browserify', 'styles', 'images', 'fonts', 'html'];

if (!config.debug) {
  arr.push('robots');
}

gulp.task('build', arr, function() {
  if (config.debug) {
    gulp.src(config.src).pipe(connect.reload());
  } else {
    setTimeout(function() {
      process.exit(0);
    }, 1000);
  }
});
