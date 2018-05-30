'use strict';

var gulp = require('gulp'),
    watch = require('gulp-watch'),
    twig = require('gulp-twig'),
    foreach = require('gulp-foreach'),
    browserSync = require('browser-sync'),
    reload = browserSync.reload,
    sourcemaps = require('gulp-sourcemaps'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    spritesmith = require('gulp.spritesmith'),
    csso = require('gulp-csso');


// Переменная с конфигом для browserSync
var config = {
    server: {
        baseDir: "./build"
    },
    // tunnel: true,
    host: 'localhost',
    port: 8000,
    logPrefix: "mesaki",
    startPath: "/views/home/",
    open: false
};


// BROWSERSYNC
gulp.task('server', function () {
    browserSync(config);
});


// TWIG
gulp.task('twig', function () {
    var g = require("./globals");
    gulp.src('./individual/views/**/*.twig')
        .pipe(foreach(function (stream, file) {
            var path = file.path.replace('.twig', '.conf.js');
            var conf = {};
            var localConf = {};
            try {
                localConf = require(path);
            } catch (e) {}
            conf.base = g.twigConfig.base;
            conf.data = Object.assign(g.twigConfig.data, localConf.data || {});
            conf.functions = Object.assign(g.twigConfig.functions, localConf.functions || {});
            conf.filters = Object.assign(g.twigConfig.filters, localConf.filters || {});

            return stream.pipe(twig(conf));
        }))
        .pipe(gulp.dest('./build/views'))
        .pipe(reload({stream: true}));
});

// TWIG CONFIG
gulp.task('twig-conf', function () {
    var g = require("./globals");
    gulp.src('./individual/views/**/*.twig')
        .pipe(foreach(function (stream, file) {
            var path = file.path.replace('.twig', '.conf.js');
            var conf = {};
            var localConf = {};
            try {
                delete require.cache[path]
                localConf = require(path);
            } catch (e) {}
            conf.base = g.twigConfig.base;
            conf.data = Object.assign(g.twigConfig.data, localConf.data || {});
            conf.functions = Object.assign(g.twigConfig.functions, localConf.functions || {});
            conf.filters = Object.assign(g.twigConfig.filters, localConf.filters || {});

            return stream.pipe(twig(conf));
        }))
        .pipe(gulp.dest('./build/views'))
        .pipe(reload({stream: true}));
});


// CSS
gulp.task('css', function(){
    gulp.src('./individual/public/scss/**/main.scss')
        .pipe(sourcemaps.init({debug: true, identityMap: true}))
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 10 versions'],
            cascade: false
        }))
        .pipe(csso())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./build/public/css'))
        .pipe(gulp.dest('./individual/public/css'))
        .pipe(reload({stream: true}))
});

// SPRITE
gulp.task('sprite', function() {
    var spriteData =
        gulp.src('./individual/public/images/sprite/*.*') // путь, откуда берем картинки для спрайта
            .pipe(spritesmith({
                imgName: 'sprite.png',
                cssName: 'sprite.scss',
                imgPath: '../images/sprite.png'
            }));

    spriteData.img.pipe(gulp.dest('./build/public/images/')); // путь, куда сохраняем картинку
    spriteData.img.pipe(gulp.dest('./individual/public/images')); // путь, куда сохраняем картинку
    spriteData.css.pipe(gulp.dest('./individual/public/scss/global/')); // путь, куда сохраняем стили
    spriteData.pipe(reload({stream: true}));
});

// JS TASK
gulp.task('js', function(){
    gulp.src('./individual/public/js/**/*.js')
        .pipe(gulp.dest('./build/public/js'))
        .pipe(reload({stream: true}));
});

// JSON
gulp.task('json', function(){
    gulp.src('./individual/views/**/*.json')
        .pipe(gulp.dest('./build/views'))
        .pipe(reload({stream: true}));
});

// IMAGES TASK
gulp.task('images', function() {
    gulp.src('./individual/public/images/**/*.*')
        .pipe(gulp.dest('./build/public/images'))
        .pipe(reload({stream: true}));
});

// FONTS TASK
gulp.task('fonts', function() {
    gulp.src('./individual/public/fonts/**/*.*')
        .pipe(gulp.dest('./build/public/fonts'))
        .pipe(reload({stream: true}));
});

// ICONS TASK
gulp.task('icons', function() {
    gulp.src('./individual/public/icons/**/*.*')
        .pipe(gulp.dest('./build/public/icons'))
        .pipe(reload({stream: true}));
});

// LIBS TASK
gulp.task('libs', function () {
    gulp.src('./individual/public/libs/**/*')
        .pipe(gulp.dest('./build/public/libs'))
        .pipe(reload({stream: true}));
});

// BUILD
gulp.task('build', [
    'twig',
    'js',
    'json',
    'css',
    'fonts',
    'images',
    'sprite',
    'icons',
    'libs'
]);

// WATCH
gulp.task('watch', function() {
    watch('./individual/views/**/*.twig',  { usePolling: true }, function() {
        gulp.start('twig');
    });    
    watch('./individual/views/**/*.conf.js',  { usePolling: true }, function() {
        gulp.start('twig-conf');
    });
    watch(['./individual/public/scss/**/*.scss', './individual/public/scss/**/*.css'],  { usePolling: true }, function() {
        gulp.start('css');
    });
    watch('./individual/public/js/**/*.js',  { usePolling: true }, function() {
        gulp.start('js');
    });
    watch('./individual/views/**/*.json',  { usePolling: true }, function() {
        gulp.start('json');
    });
    watch('./individual/public/images/**/*.svg',  { usePolling: true }, function() {
        gulp.start('images');
    });
    watch(['./individual/public/images/**/*.*','!./individual/public/images/**/*.svg'],  { usePolling: true }, function() {
        gulp.start('images');
        gulp.start('sprite');
    });
    watch('./individual/public/fonts/**/*.*',  { usePolling: true }, function() {
        gulp.start('fonts');
    });
    watch('./individual/public/icons/**/*.*',  { usePolling: true }, function() {
        gulp.start('icons');
    });
    watch('./individual/public/libs/**/*.*',  { usePolling: true }, function() {
        gulp.start('libs');
    });
});

// DEFAULT TASK
gulp.task('default', ['build', 'server', 'watch']);

