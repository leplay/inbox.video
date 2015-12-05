var gulp = require('gulp');
var revReplace = require('gulp-rev-replace');
var cdnizer = require("gulp-cdnizer");
var config = require('../config').html;

var arr = [];

if (!config.debug) {
  arr = ['browserify', 'styles'];
}

gulp.task('html', arr, function() {
  if (config.debug) {
    return gulp.src(config.src)
      .pipe(gulp.dest(config.dest));
  } else {
    var style = gulp.src('./' + config.styleDest + '/rev-manifest.json');
    var script = gulp.src('./' + config.scriptDest + '/rev-manifest.json');
    return gulp.src(config.src)
        //   .pipe(cdnizer({
        //     defaultCDNBase: config.cdn,
        //     allowRev: true,
        //     allowMin: true,
        //     files: [
        //       'styles/*.css',
        //       'scripts/*.js',
        //       'images/*.*'
        //     ]
        // }))
      .pipe(revReplace({manifest: style}))
      .pipe(revReplace({manifest: script}))
      .pipe(gulp.dest(config.dest));
    }
});
