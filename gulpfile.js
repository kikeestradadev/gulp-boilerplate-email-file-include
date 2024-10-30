const gulp = require('gulp');
const fileInclude = require('gulp-file-include');
const formatHtml = require('gulp-format-html');
const browserSync = require('browser-sync').create();
const htmlhint = require('gulp-htmlhint');
const sass = require('sass');  // Importando Dart Sass
const gulpSass = require('gulp-sass')(sass);  // Conectando gulp-sass con Dart Sass

const paths = {
    html: 'src/html/*.html',
    sass: 'src/scss/**/*.scss',
    pieces: 'src/html/modules/**/*.html',  // Añadimos los módulos como parte del watch
    dist: 'public',
    cssOutput: 'public/css/'  // Guardar CSS en public/css/
};

// Tarea para compilar Sass
gulp.task('sass', function () {
    return gulp.src(paths.sass)
        .pipe(gulpSass().on('error', gulpSass.logError))
        .pipe(gulp.dest(paths.cssOutput))
        .pipe(browserSync.stream());
});

// Tarea para procesar HTML e incluir módulos
gulp.task('html', function () {
    return gulp.src(paths.html)
        .pipe(fileInclude({
            prefix: '_',
            basepath: '@file',
            suffix: ''
        }))
        .pipe(htmlhint('.htmlhintrc'))
        .pipe(htmlhint.reporter())
        .pipe(formatHtml())
        .pipe(gulp.dest(paths.dist))
        .pipe(browserSync.stream());
});

// Tarea para inicializar BrowserSync y servir archivos
gulp.task('serve', function () {
    browserSync.init({
        server: {
            baseDir: paths.dist
        }
    });

    // Vigilar cambios en Sass
    gulp.watch(paths.sass, gulp.series('sass'));

    // Vigilar cambios en HTML y en módulos de `pieces/`
    gulp.watch([paths.html, paths.pieces]).on('change', gulp.series('html', browserSync.reload));
});

// Tarea por defecto
gulp.task('default', gulp.parallel('html', 'sass', 'serve'));
