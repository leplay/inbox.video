'use strict';

var dest = './dist';
var src = './app';
var gutil = require('gulp-util');
var debug = gutil.env.type === 'dev';

module.exports = {
  server: {
    settings: {
      root: dest,
      host: 'localhost',
      port: 8080,
      livereload: {
        port: 35929
      }
    }
  },
  sass: {
    src: src + '/styles/**/*.{sass,scss,css}',
    dest: dest + '/styles',
    settings: {
      outputStyle: gutil.env.type === 'dev' ? 'nested' : 'compressed',
      indentedSyntax: false, // Enable .sass syntax?
      imagePath: '/images' // Used by the image-url helper
    },
    debug: debug
  },
  images: {
    src: src + '/images/*.{png,jpg,gif}',
    dest: dest + '/images'
  },
  fonts: {
    src: src + '/fonts/*.*',
    dest: dest + '/fonts'
  },
  browserify: {
    settings: {
      transform: ['reactify', 'babelify']
    },
    src: src + '/scripts/index.jsx',
    dest: dest + '/scripts',
    outputName: 'index.js',
    debug: debug
  },
  html: {
    src: 'app/*.html',
    styleDest: dest + '/styles',
    scriptDest: dest + '/scripts',
    dest: dest,
    debug: debug
  },
  robots: {
    src: 'app/robots.txt',
    dest: dest,
    debug: debug
  },
  clean: {
    src: dest + '/{styles,scripts}/*.*'
  },
  manifest: {
    filename: 'cache.manifest',
    files: 'dist/**/*.{html,css,js,png,jpg,eot,svg,ttf,woff,otf}',
    dest: dest
  },
  watch: {
    src: 'app/**/*.*',
    tasks: ['build'],
    debug: debug
  }
};
