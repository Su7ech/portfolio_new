var gulp = require('gulp');
var sass = require('gulp-sass');
var pug = require('gulp-pug');
var imagemin = require('gulp-imagemin');
var newer = require('gulp-newer');
var cache = require('gulp-cache');
var prefixer = require('gulp-autoprefixer');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync').create();
var runSequence = require('run-sequence');

gulp.task('server', function() {
    browserSync.init({
        server: {
            baseDir: "src"
        },
        notify: false
    });

    gulp.watch("src/scss/*.+(scss|sass)", ['sass']);
    gulp.watch("src/pugfiles/**/*.pug", ['pug']);
    gulp.watch("src/**/*.html").on('change', browserSync.reload);
});

gulp.task('sass', function() {
    return gulp.src("src/scss/**/*.+(scss|sass)")
      .pipe(sourcemaps.init())
      .pipe(sass().on('error', sass.logError))
      .pipe(sourcemaps.write())
      .pipe(prefixer({
        browsers: ['last 2 versions', '> 5%', 'Firefox ESR']
      }))
      .pipe(gulp.dest("src/css"))
      .pipe(browserSync.stream());
  });

  gulp.task('imagemin', function() {
    return gulp.src("src/img/*")
      .pipe(newer())
      .pipe(cache(imagemin({
        interlaced: true
      })))
      .pipe(gulp.dest("dist/img"));
  });
  
  gulp.task('pug', function() {
    return gulp.src("src/pugfiles/**/!(_)*.pug")
      .pipe(pug({
        pretty: true
      }))
      .pipe(gulp.dest("src/"))
      .pipe(browserSync.stream());
  });

  gulp.task('default', function(cb){
    runSequence(['sass', 'pug'], 'server', cb);
  });