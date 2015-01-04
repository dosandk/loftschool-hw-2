var gulp = require('gulp'),
    concat = require('gulp-concat'),
    minify = require('gulp-minify-css'),
    prefix = require('gulp-autoprefixer'),
    livereload = require('gulp-livereload'),
    connect = require('gulp-connect'),
    mainBowerFiles = require('main-bower-files'),
    gulpFilter = require('gulp-filter'),
    imgOptimization = require('gulp-image-optimization'),
    imagemin = require('gulp-imagemin'),
    optipng = require('gulp-optipng'),
    cache = require('gulp-cache'),
    rename = require('gulp-rename'),
    notify = require('gulp-notify'),
    size = require('gulp-size'),
    plumber = require('gulp-plumber'),
    uncss = require('gulp-uncss'),
    compass = require('gulp-compass');

gulp.task('compass', function() {
    return gulp.src('./dev/scss/*.scss')
        .pipe(compass({
            config_file: './config.rb',
            css: 'dev/css',
            sass: 'dev/scss',
            assetCacheBuster: false
        }))
        .pipe(gulp.dest('./dev/css'));
});

gulp.task('images', function() {

    gulp.src('app/img/**')
        .pipe(plumber())
        .pipe(size({title: 'Before optimization'}))
        .pipe(cache(imgOptimization({ optimizationLevel: 5, progressive: true, interlaced: true})))
        .pipe(size({title: 'After optimization'}))
        .pipe(gulp.dest('dist/img'));
});

gulp.task('clear', function (done) {
    return cache.clearAll(done);
});

gulp.task('getBowerJsFiles', function() {
    return gulp.src(mainBowerFiles())
        .pipe(gulpFilter('**/*.js'))
        .pipe(gulp.dest('app/riba'));
});

gulp.task('concatCss', function() {
    return gulp.src(['app/css/**'])
        .pipe(plumber())
        .pipe(size({showFiles: true}))
        .pipe(concat('ui.css'))
        .pipe(size({title: 'Cleaned css'}))
        .pipe(size({title: 'Concatenated Css'}))
        .pipe(minify())
        .pipe(rename({suffix: '.min'}))
        .pipe(size({title: 'Minified Css'}))
        .pipe(gulp.dest('dist/css/'));
});

gulp.task('uncss', function() {
    return gulp.src('dist/css/ui.min.css')
        .pipe(plumber())
        .pipe(uncss({
            html: ['dist/index.html']
        }))
        .pipe(gulp.dest('dist/css/out'));
});

gulp.task('html', function() {
    gulp.src(['./app/index.html'])
        .pipe(connect.reload());
});

// server connect
gulp.task('connect', function() {
    connect.server({
        root: 'app',
        port: 8000,
        livereload: true
    });
});

gulp.task('watch', function() {
    gulp.watch('./dev/css/*.css', ['concatCss']);
    gulp.watch('./app/index.html', ['html']);
});

gulp.task('default', ['connect', 'html', 'concatCss', 'watch']);