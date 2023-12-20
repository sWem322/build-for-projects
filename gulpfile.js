const gulp = require('gulp');

const sass = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;
const browserSync = require('browser-sync').create();
const autoprefixer = require('gulp-autoprefixer');
const clean = require('gulp-clean');

function script() {
    return gulp.src([
        'app/js/*.js',
        '!app/js/main.min.js'
    ])

        .pipe(concat('main.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('app/js'))
        .pipe(browserSync.stream());

}

function styles() {
    return gulp.src('app/scss/style.scss')
        .pipe(sass.sync({ outputStyle: 'compressed' }).on('error', sass.logError))
        .pipe(autoprefixer({ overrideBrowserslist: ['last 10 version'] }))
        .pipe(concat('style.min.css'))
        .pipe(gulp.dest('app/css'))
        .pipe(browserSync.stream());
};

function watching() {
    gulp.watch(['app/scss/style.scss'], styles)
    gulp.watch(['app/*.html']).on('change', browserSync.reload);
    gulp.watch([
        'app/js/*.js',
        '!app/js/main.min.js'
    ], script)
}


function browsersync() {
    browserSync.init({
        server: {
            baseDir: "app/"
        }
    });
}

function cleanDist() {
    return gulp.src('dist')
        .pipe(clean())
}

function buildDist() {
    return gulp.src([
        'app/css/style.min.css',
        'app/js/main.min.js',
        'app/*.html'
    ], { base: 'app' })
        .pipe(gulp.dest('dist'))
}


exports.styles = styles;
exports.script = script;
exports.watching = watching;
exports.browsersync = browsersync;

exports.build = gulp.series(cleanDist, buildDist)
exports.dev = gulp.parallel(styles, script, browsersync, watching)