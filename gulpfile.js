const gulp = require('gulp');
const fileInclude = require('gulp-file-include');
const formatHtml = require('gulp-format-html');
const browserSync = require('browser-sync').create();
const htmlhint = require('gulp-htmlhint');

// Asegúrate de usar Dart Sass directamente
const sass = require('sass');  // Importando Dart Sass correctamente
const gulpSass = require('gulp-sass')(sass);  // Conectando gulp-sass con Dart Sass

const paths = {
    html: 'src/html/*.html',
    sass: 'src/scss/**/*.scss',
    dist: 'public',
    cssOutput: 'src/html/'  // Ruta de salida del CSS
};

// Tarea para compilar Sass usando Dart Sass moderno
gulp.task('sass', function () {
    return gulp.src(paths.sass)
        .pipe(gulpSass().on('error', gulpSass.logError))  // Usa Dart Sass correctamente
        .pipe(gulp.dest(paths.cssOutput));
});

// Tarea para procesar HTML e incluir componentes
gulp.task('html', function() {
    return gulp.src(paths.html)
        .pipe(fileInclude({
            prefix: '_',
            basepath: '@file',
            suffix: ''
        }))
        .pipe(htmlhint())
        .pipe(htmlhint.reporter())
        .pipe(formatHtml())
        .pipe(gulp.dest(paths.dist))
        .pipe(browserSync.stream());
});

// Tarea para inicializar browserSync y servir archivos
gulp.task('serve', function() {
    browserSync.init({
        server: {
            baseDir: paths.dist
        }
    });

    gulp.watch(paths.sass, gulp.series('sass', 'html'));
    gulp.watch(paths.html, gulp.series('html'));
});

// Tarea por defecto para ejecutar todo en paralelo
gulp.task('default', gulp.parallel('html', 'sass', 'serve'));
