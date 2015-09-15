// For more information on how to configure a task runner, please visit:
// https://github.com/gulpjs/gulp

var gulp    = require('gulp');
var clean   = require('gulp-clean');
var rename  = require('gulp-rename');
var concat  = require('gulp-concat');
var jshint  = require('gulp-jshint');
var uglify  = require('gulp-uglifyjs');
var sass    = require('gulp-sass');
var csso    = require('gulp-csso');
var browserify = require('gulp-browserify');
var es      = require('event-stream');
var sprity = require('sprity');
var gulpif = require('gulp-if');

gulp.task('clean', function () {
  // Clear the destination folder
  gulp.src('css/**/*.css', { read: false })
    .pipe(clean({ force: true }));
});

gulp.task('styles', function () {
  return gulp.src('_sass/main.scss')
      .pipe(sass())
      .pipe(rename('main.css'))
      .pipe(csso())
      .pipe(gulp.dest('css'))
});

gulp.task('scripts', function () {
  return es.concat(
    // Detect errors and potential problems in your JavaScript code
    // You can enable or disable default JSHint options in the .jshintrc file
    gulp.src(['js/scripts.js'])
      .pipe(jshint('.jshintrc'))
      .pipe(jshint.reporter(require('jshint-stylish'))),

    gulp.src(['js/scripts.js'])
      .pipe(uglify())
      .pipe(rename('scripts.min.js'))
      .pipe(gulp.dest('./js')), // pipe it to the output DIR


    // Concatenate and copy all vendor scripts
    gulp.src('js/vendor/**')
      .pipe(uglify())
      .pipe(concat('default.js'))
      .pipe(gulp.dest('./js')) // pipe it to the output DIR


  );
});

gulp.task('sprites', function () {
  return sprity.src({
      src: 'img/communities/gray/*.png',
      name: 'communities',
      style: '_sprite.scss',
      cssPath: '/img/communities/',
      processor: 'sass',
      prefix: 'community',
      'dimension': [{
        ratio: 1, dpi: 72
      }, {
        ratio: 2, dpi: 192
      }],
    })
    .pipe(gulpif('*.png', gulp.dest('./img/communities/')))
    .pipe(gulpif('*.scss', gulp.dest('./_sass/partials/')));
});

gulp.task('watch', function () {

  // Watch .scss files and run tasks if they change
  gulp.watch('_sass/**/*.scss', ['styles']);

  // Watch .js files and run tasks if they change
  gulp.watch('js/**/*.js', ['scripts']);

});

// The dist task (used to store all files that will go to the server)
gulp.task('dist', ['clean', 'styles', 'scripts']);

// The default task (called when you run `gulp`)
gulp.task('default', ['clean', 'styles', 'scripts', 'watch']);
