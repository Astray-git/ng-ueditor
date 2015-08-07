'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

var SRC = 'src/';
var DIST = 'dist/';

// Lint JavaScript
gulp.task(
    'jshint',
    function () {
        return gulp
            .src(SRC + '**/*.js')
            .pipe($.jshint())
            .pipe($.jshint.reporter('jshint-stylish'))
        ;
    }
);

gulp.task(
    'build',
    function () {
        return gulp
            .src(SRC + '**/*.js')
            .pipe($.uglify())
            .pipe($.rename({ extname: '.min.js' }))
            .pipe(gulp.dest(DIST));
    }
);
