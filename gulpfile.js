
"use strict";

const gulp = require('gulp');

let js_libs = [
    'node_modules/angular/angular.min.js',
    'node_modules/angular-material/angular-material.min.js',
    'node_modules/angular-animate/angular-animate.min.js',
    'node_modules/angular-aria/angular-aria.min.js',
    'node_modules/hls.js/dist/hls.min.js',
    'node_modules/angular-new-router/dist/router.es5.min.js'
];

let css_libs = [
    'node_modules/angular-material/angular-material.min.css',
    'node_modules/font-awesome/css/font-awesome.min.css'
];

let fonts = [
    'node_modules/font-awesome/fonts/*'
];

gulp.task('move_libs', () => {
    return gulp.src(js_libs)
               .pipe(gulp.dest('kraken/lib/js/'));
});

gulp.task('move_css', () => {
    return gulp.src(css_libs)
               .pipe(gulp.dest('kraken/lib/css/'));
});

gulp.task('move_fonts', () => {
    return gulp.src(fonts)
               .pipe(gulp.dest('kraken/lib/fonts/'));
});

gulp.task('default', ['move_libs', 'move_css', 'move_fonts']);