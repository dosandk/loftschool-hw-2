var gulp = require('gulp'),
    concat = require('gulp-concat'),
    minify = require('gulp-minify-css');

gulp.task('concatCss', function() {
    return gulp.src(['app/css/**'])
        .pipe(concat('ui.min.css'))
        .pipe(minify())
        .pipe(gulp.dest('dist/css'))
});

gulp.task('concatJs', function() {
    return gulp.src(['app/js/**'])
        .pipe(concat('app.min.js'))
        .pipe(minify())
        .pipe(gulp.dest('dist/js'))
});

gulp.task('buildApp', function() {

});

gulp.task('default', ['buildApp']);