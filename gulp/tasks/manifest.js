var gulp = require('gulp');
var manifest = require('gulp-manifest');
var config = require('../config').manifest;

gulp.task('manifest', function(){
  gulp.src([config.files])
    .pipe(manifest({
      hash: true,
      preferOnline: true,
      network: ['http://*', 'https://*', '*'],
      filename: config.filename,
      exclude: [config.filename]
     }))
    .pipe(gulp.dest(config.dest));
});