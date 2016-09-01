var gulp = require('gulp');
var config = require('../config').robots;

gulp.task('robots', function() {
  return gulp.src(config.src)
    .pipe(gulp.dest(config.dest));
});
