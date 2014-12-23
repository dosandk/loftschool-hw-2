var gulp = require('gulp'),
    concat = require('gulp-concat'),
    minify = require('gulp-minify-css'),
    prefix = require('gulp-autoprefixer'),
    livereload = require('gulp-livereload'),
    connect = require('gulp-connect'),
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

gulp.task('concat', ['compass'], function() {
    return gulp.src(['./dev/css/*.css'])
        .pipe(concat('ui.min.css'))
        .pipe(gulp.dest('./app/css'))
});

gulp.task('concatCss', function() {
    return gulp.src(['./dev/css/**'])
        .pipe(concat('ui.min.css'))
        //.pipe(prefix({
        //    browsers: ['> 1%', 'last 2 versions', 'ie 8']
        //}))
        .pipe(minify())
        .pipe(gulp.dest('./app/css/ui'))
        .pipe(connect.reload());
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