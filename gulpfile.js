var gulp = require('gulp');
var ts = require('gulp-typescript');
var browserSync = require('browser-sync');
var sass = require('gulp-sass');
var bower = require('gulp-bower');

gulp.task('bower', function () {
  return bower()
    .pipe(gulp.dest('bower_components/'))
});

var tsProject = ts.createProject({
  typescript: require('typescript'),
  noImplicitAny: true,
  out: 'gapminder.js'
});

gulp.task('typescript', function () {
  var tsResult = gulp.src('src/**/*.ts')
    .pipe(ts(tsProject));
  return tsResult.js.pipe(gulp.dest('.tmp/scripts'));
});

gulp.task('sass', function () {
  gulp.src('src/styles/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('.tmp/styles'));
});

gulp.task('default', ['bower', 'sass', 'typescript'], function () {
  browserSync({
    open: false,
    server: {
      baseDir: ["src",".tmp"],
      routes: {
        "/bower_components": "bower_components"
      }
    }
  });

  gulp.watch(['src/**/*.scss'], ['sass', browserSync.reload]);
  gulp.watch('src/**/*.ts', ['typescript', browserSync.reload]);
  gulp.watch(['src/**/*.html'], browserSync.reload);
});
