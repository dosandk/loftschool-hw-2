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
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    newer = require('gulp-newer'),
    connect = require('gulp-connect'),
    compass = require('gulp-compass');

var basePath = {
    app  : 'app/',
    dist : 'dist/'
};

var appPaths = {
    css     : basePath.app + 'css/',
    js      : basePath.app + 'js/',
    jade    : basePath.app + 'jade/',
    html    : basePath.app + 'html/',
    img     : basePath.app + 'img/',
    fonts   : basePath.app + 'fonts/',
    phpCore : basePath.app + 'php-core/',
    scss    : basePath.app + 'scss/'
};

var distPaths = {
    css     : basePath.dist + 'css/',
    js      : basePath.dist + 'js/',
    img     : basePath.dist + 'img/',
    fonts   : basePath.dist + 'fonts/',
    phpCore : basePath.dist + 'php-core/'
};

/* --------------- BUILD TASKS --------------- */

gulp.task('buildApp', ['buildHTML', 'buildCss', 'buildJs', 'buildIMG', 'buildFonts', 'buildPHP']);

gulp.task('cleanBuildDir', function (cb) {
    del([basePath.dist], cb);
});

gulp.task('buildHTML', ['cleanBuildDir'], function() {
    gulp.src(appPaths.jade +'*.jade')
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
            docRoot : basePath.dist,
            filetypes : ['png', 'jpg']
        }))
        .pipe(gulp.dest(basePath.dist))
});

gulp.task('buildCss', ['buildHTML'], function() {
    return gulp.src([appPaths.css + '**'])
        .pipe(plumber())
        .pipe(size({showFiles: true}))
        .pipe(csscomb())
        .pipe(concat('ui.css'))
        .pipe(size({title: 'Concatenated Css'}))
        .pipe(uncss({
            html: [basePath.dist + 'index.html']
        }))
        .pipe(size({title: 'uncss'}))
        .pipe(minify())
        .pipe(rename({suffix: '.min'}))
        .pipe(size({title: 'Minified Css'}))
        .pipe(gulp.dest(distPaths.css));
});

gulp.task('buildJs', ['buildCss'], function() {
    return gulp.src([
            appPaths.js + 'libs/**',
            appPaths.js + 'app.js',
            '!' + appPaths.js + 'libs/{html5js,html5js/**}'
        ])
        .pipe(plumber())
        .pipe(concat('ui.js'))
        /*.pipe(assetpaths({
            newDomain: '.',
            oldDomain : 'old-domain',
            docRoot : 'dist',
            filetypes : ['php']
        }))*/
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(size())
        .pipe(gulp.dest('dist/js'))
});

gulp.task('buildIMG', ['cleanBuildDir'], function() {
    return gulp.src([
            appPaths.img + '**',
            '!' + appPaths.img + '{ui,ui/**}'
        ])
        .pipe(plumber())
        .pipe(imagemin({
            progressive: true,
            use: [pngquant()]
        }))
        .pipe(size({showFiles: true}))
        .pipe(gulp.dest(distPaths.img));
});

gulp.task('buildFonts', ['cleanBuildDir'], function() {
    return gulp.src(appPaths.fonts + '**')
        .pipe(gulp.dest(distPaths.fonts));
});

gulp.task('buildPHP', ['cleanBuildDir'], function() {
    return gulp.src(appPaths.phpCore + '**')
        .pipe(gulp.dest(distPaths.phpCore));
});

/* --------------- WATCHERS AND LIVERELOAD--------------- */

gulp.task('watch', ['connect'], function() {
    gulp.watch(appPaths.img + '**', ['compressImg']);
    gulp.watch(appPaths.scss + '**', ['compileScss']);
    gulp.watch(appPaths.jade + '**', ['compileJade']);
});

gulp.task('compressImg', function() {
    return gulp.src(appPaths.img + '**')
        .pipe(newer(appPaths.img))
        .pipe(imagemin({
            progressive: true,
            use: [pngquant()]
        }))
        .pipe(gulp.dest(appPaths.img));
});

gulp.task('compileJade', function() {
    return gulp.src(appPaths.jade + '*.jade')
        .pipe(plumber())
        .pipe(jade({pretty: true}))
        .pipe(gulp.dest(appPaths.html))
        .pipe(connect.reload());
});

gulp.task('compileScss', function() {
    return gulp.src(appPaths.scss + '**')
        .pipe(plumber())
        .pipe(compass({
            config_file: 'config.rb',
            css: 'app/css',
            sass: 'app/scss'
        }))
        .pipe(gulp.dest('app/css'))
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

/* --------------- ACCESSORY TASKS --------------- */

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


gulp.task('default', ['buildApp']);