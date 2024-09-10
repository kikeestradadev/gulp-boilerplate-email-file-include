const gulp = require('gulp');
const fileInclude = require('gulp-file-include');
const formatHtml = require('gulp-format-html');
const sass = require('gulp-sass')(require('sass'));
const browserSync = require('browser-sync').create();
const htmlhint = require('gulp-htmlhint');

const paths = {
    html: 'src/html/*.html',
    sass: 'src/scss/*.scss',
    dist: 'public'
};

// Task for including HTML files and validating with htmlhint
gulp.task('html', function() {
    return gulp.src(paths.html)
        .pipe(fileInclude({ 
            prefix: '_',  // Custom syntax without parentheses
            basepath: '@file',  // Relative to the file being included
            suffix: ''  // No suffix needed
        }))
        .pipe(htmlhint())  // Validate HTML
        .pipe(htmlhint.reporter())  // Report validation results
        .pipe(formatHtml())
        .pipe(gulp.dest(paths.dist))
        .pipe(browserSync.stream());
});

// Task for compiling Sass and saving in src/scss/
gulp.task('sass', function() {
    return gulp.src(paths.sass)
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('src/html'))  // Save compiled CSS in src/html/
        .pipe(browserSync.stream());
});

// Task to initialize browserSync and serve files
gulp.task('serve', function() {
    browserSync.init({
        server: {
            baseDir: paths.dist
        }
    });

    gulp.watch(paths.sass, gulp.series('sass', 'html'));  // After compiling Sass, also recompile HTML
    gulp.watch(paths.html, gulp.series('html'));  // Watch for changes in HTML
});

// Default task to run both tasks
gulp.task('default', gulp.parallel('html', 'sass', 'serve'));
