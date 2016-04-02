//gulpfile.js
//task runner
//v0.0.0
//

(() => {

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



    gulp.task('move_libs', () => {
        js_libs.forEach((lib) => {
            gulp.src(lib)
                .pipe(gulp.dest('kraken/lib/js/'));
        });
    });

    gulp.task('move_css', () => {

        //main angular-material css
        gulp.src('node_modules/angular-material/angular-material.min.css')
            .pipe(gulp.dest('kraken/lib/css/'));

        //main font-awesome css
        gulp.src('node_modules/font-awesome/css/font-awesome.min.css')
            .pipe(gulp.dest('kraken/lib/css/'));
        
        //font-awesome font files
        gulp.src('node_modules/font-awesome/fonts/*')
            .pipe(gulp.dest('kraken/lib/fonts/'));
        
    });

    gulp.task('default', ['move_libs', 'move_css']);

})();