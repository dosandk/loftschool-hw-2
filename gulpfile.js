var gulp = require('gulp'),
    concat = require('gulp-concat'),
    minify = require('gulp-minify-css'),
    mainBowerFiles = require('main-bower-files'),
    gulpFilter = require('gulp-filter'),
    cache = require('gulp-cache'),
    rename = require('gulp-rename'),
    size = require('gulp-size'),
    plumber = require('gulp-plumber'),
    uncss = require('gulp-uncss'),
    uglify = require('gulp-uglify'),
    del = require('del'),
    csscomb = require('gulp-csscomb'),
    preprocess = require('gulp-preprocess'),
    assetpaths = require('gulp-assetpaths'),
    jade = require('gulp-jade'),
    htmlreplace = require('gulp-html-replace'),
    compass = require('gulp-compass');

var basePath = {
    app  : 'app/',
    dist : 'dist/'
};

var srcAssets = {
    css   : basePath.app + 'css/',
    js    : basePath.app + 'js/',
    img   : basePath.app + 'img/',
    fonts : basePath.app + 'fonts/',
    core  : basePath.app + 'php-core/',
    scss  : basePath.app + 'scss/'
};

var destAssets = {
    css  : basePath.dist + 'css/',
    js   : basePath.dist + 'js/',
    img  : basePath.dist + 'img/'
};

/* --------------- BUILD TASKS --------------- */

gulp.task('buildApp', ['buildHTML', 'buildCss', 'buildJs', 'buildIMG']);


gulp.task('cleanBuildDir', function (cb) {
    del(['dist'], cb);
});

gulp.task('buildHTML', ['cleanBuildDir'], function() {
    gulp.src('./app/jade/*.jade')
        .pipe(plumber())
        .pipe(jade({pretty: true}))
        .pipe(preprocess({context: { environment: 'production', DEBUG: true }}))
        .pipe(htmlreplace({
            'css': 'css/ui.min.css',
            'js': 'js/ui.min.js'
        }))
        .pipe(assetpaths({
            newDomain: '.',
            oldDomain : 'old-domain',
            docRoot : 'dist',
            filetypes : ['png', 'jpg']
        }))
        .pipe(gulp.dest('dist'))
});

gulp.task('buildCss', ['buildHTML'], function() {
    return gulp.src(['app/css/**'])
        .pipe(plumber())
        .pipe(size({showFiles: true}))
        .pipe(csscomb())
        .pipe(concat('ui.css'))
        .pipe(size({title: 'Concatenated Css'}))
        .pipe(uncss({
            html: ['dist/index.html']
        }))
        .pipe(size({title: 'uncss'}))
        .pipe(minify())
        .pipe(rename({suffix: '.min'}))
        .pipe(size({title: 'Minified Css'}))
        .pipe(gulp.dest('dist/css/'));
});

gulp.task('buildJs', ['buildCss'], function() {
    return gulp.src(['app/js/**', '!app/js/libs/{html5js,html5js/**}'])
        .pipe(plumber())
        .pipe(concat('ui.js'))
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(size())
        .pipe(gulp.dest('dist/js'))
});

gulp.task('buildIMG', ['cleanBuildDir'], function() {
    return gulp.src(['app/img/**', '!app/img/{ui,ui/**}'])
        .pipe(plumber())
        .pipe(gulp.dest('dist/img'));
});

gulp.task('buildFonts', ['cleanBuildDir'], function() {
    return gulp.src('app/fonts/**')
        .pipe(gulp.dest('dist/fonts'));
});

gulp.task('buildPHP', ['cleanBuildDir'], function() {
    return gulp.src('app/php-core/**')
        .pipe(gulp.dest('dist/php-core'));
});


/* --------------- ACCESSORY TASKS --------------- */

gulp.task('compass', function() {
    gulp.src(srcAssets.scss + '*.scss')
        .pipe(plumber())
        .pipe(compass({
            config_file: 'config.rb',
            css: srcAssets.css,
            sass: srcAssets.scss
        }));
});

gulp.task('csscomb', function() {
    return gulp.src('app/css/**')
        .pipe(csscomb())
        .pipe(gulp.dest('app/riba/css'));
});

gulp.task('clearCache', function (done) {
    return cache.clearAll(done);
});

gulp.task('getBowerJsFiles', function() {
    return gulp.src(mainBowerFiles())
        .pipe(gulpFilter('**/*.js'))
        .pipe(gulp.dest('app/riba'));
});

gulp.task('minifyHTML', function() {
    gulp.src('app/html/*.html')
        .pipe(plumber())
        .pipe(assetpaths({
            newDomain: '.',
            oldDomain : 'foo',
            docRoot : 'dist/html-min',
            filetypes : ['css', 'png', 'jpg']
        }))
        //.pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('dist/html-min'))
});

gulp.task('uncss', function() {
    gulp.src('dist/css/ui.min.css')
        .pipe(plumber())
        .pipe(uncss({
            html: ['dist/index.html']
        }))
        .pipe(gulp.dest('dist/css/out'));
});


gulp.task('watch', function() {
    gulp.watch('./dev/css/*.css', ['concatCss']);
    gulp.watch('./app/index.html', ['html']);
});

gulp.task('default', ['buildApp']);