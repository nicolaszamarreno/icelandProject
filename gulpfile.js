'use strict';

// Node module natifs
var fs = require("fs");
var path = require("path")

// Load Gulp for execution
var gulp = require("gulp");

// Compile SASS
var sass = require("gulp-sass");
var postcss = require("gulp-postcss");
var csswring = require("csswring"); // Permet de réunir toutes les propriétés CSS en une 
var mqpacker = require("css-mqpacker");
var pxtorem = require("pxtorem");
var minifyCss = require("gulp-minify-css"); 
var sourcemaps = require("gulp-sourcemaps");
var autoprefixer = require("autoprefixer");

// Compile JS
var useref = require("gulp-useref"); 
var uglify = require("gulp-uglify");


// Others
var plumber = require("gulp-plumber"); 
var rename = require("gulp-rename");

// Servers
var browserSync = require("browser-sync").create();
var reload = browserSync.reload;

// Inject CSS & JS
var inject = require("gulp-inject");

// Module for Mailing
var inlineCss = require("gulp-inline-css");

// Optimisation Images
var spritesmith = require("gulp-spritesmith"); // Unification de toutes les images utiles en une (icones...)


// Variable Environment | wordpress, prod, dist
var environment = "prod";

// Initialisation Folders
switch(environment){
  case "prod" :
    var prodFolder = "app/";
    var distFolder = "dist/"; 
  break;
}

// Tab Processors 
var processors = [
    autoprefixer({browsers: ['last 2 versions','> 2%','ie >= 9']}),
    mqpacker,
    csswring,
    pxtorem
];

// Compilation du SASS
gulp.task("sass", function(){
  return gulp.src(prodFolder + 'scss/main.scss')
  .pipe(plumber())
  .pipe(sourcemaps.init())
  .pipe(sass({ outputStyle: 'expanded' })
              .on('error', sass.logError)
        )
  .pipe(postcss(processors))
  .pipe(sourcemaps.write())
  .pipe(rename("style.css"))
  .pipe(gulp.dest("./app/css"))
  .pipe(browserSync.stream())
});

// Injection des feuilles de style
gulp.task('inject', function () {
  var target = gulp.src(prodFolder + '*.html');
  return target.pipe(inject(
                            gulp.src([prodFolder + 'js/**/*.js', prodFolder + 'css/**/*.css'], {read: false}),
                            // Options
                            {
                                ignorePath: 'app',
                                addRootSlash: false
                            }
                            ))
  .pipe(gulp.dest(prodFolder));
});


// Compress JS
gulp.task('compress-js', function() {
  return gulp.src('dist/js/**/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('dist/js/'));
});

// Compress CSS
gulp.task('compress-css', function() {
  return gulp.src('dist/css/**/*.css')
    .pipe(minifyCss())
    .pipe(gulp.dest('dist/css/'));
});

gulp.task('mailing', function() {
    return gulp.src('./*.html')
        .pipe(inlineCss({
            applyStyleTags: true,
            applyLinkTags: true,
            removeStyleTags: true,
            removeLinkTags: true
        }))
        .pipe(gulp.dest(distFolder));
});

// Action pour Production
gulp.task('production', ['sass', 'inject'], function() {

    browserSync.init({
        server: prodFolder,
        ghostMode: {
          scroll: true,
          links: true,
          forms: true
        }
    });

    gulp.watch(prodFolder + "scss/*.scss", ['sass','inject']);
    gulp.watch(prodFolder + "js/**/*.js", ['inject']);
    gulp.watch(prodFolder + "*.html", ['inject']);
    gulp.watch(prodFolder + "*.html").on('change', browserSync.reload);
    gulp.watch(prodFolder + "js/**/*.js").on('change', browserSync.reload);
});

// **
//** Pour LocalHost
//**
gulp.task('browserSync', function(){
  return browserSync.init({
    proxy:'http://localhost',
    startPath:"index.php",
    ghostMode: {
      scroll: true,
      links: true,
      forms: true
    },
    watchTask:true
  });
});

gulp.task('productionLocal', ['sass', 'inject', 'browserSync'], function() {
    gulp.watch(prodFolder + "scss/*.scss", ['sass','inject']);
    gulp.watch(prodFolder + "js/**/*.js", ['inject']);
    gulp.watch(prodFolder + "*.html", ['inject']);
    gulp.watch(prodFolder + "*.html").on('change', browserSync.reload);
    gulp.watch(prodFolder + "js/**/*.js").on('change', browserSync.reload);
});
// **
//** Fin Localhost
//**

gulp.task('minify-ressources', function () {
  return gulp.src(prodFolder + '*.html')
  .pipe(useref())
  .pipe(gulp.dest('dist/'));
  console.log('Lancer la tâche "distribution" pour Minify CSS et JS');
});


// Action pour Distribution
gulp.task('distribution', ['compress-js','compress-css'], function() {
  console.log("JavaScript Minify | CSS Minify");
});










