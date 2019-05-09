const del = require('del'),
  gulp = require('gulp'),
  gulpif = require('gulp-if'),
  sass = require('gulp-sass'),
  uglify = require('gulp-uglify'),
  htmlmin = require('gulp-htmlmin'),
  rename = require('gulp-rename'),
  jshint = require('gulp-jshint'),
  stylish = require('jshint-stylish'),
  browserSync = require('browser-sync').create(),
  gulpSequence = require('gulp4-run-sequence');

var prod = false;

var paths = {
  dist: {
    src: 'src/',
    dest: 'build/'
  },
  styles: {
    src: 'src/assets/sass/**/*.sass',
    dest: 'src/assets/css/',
    build: 'build/assets/css/'
  },
  fonts: {
    src: 'src/assets/fonts/*',
    build: 'build/assets/fonts/'
  },
  scripts: {
    src: 'src/assets/js/editable/*.js',
    dest: 'src/assets/js/',
    build: 'build/assets/js/'
  },
  images: {
    src: 'src/assets/img/**/*.*',
    build: 'build/assets/img/'
  },
  html: {
    src: 'src/**/*.html',
    build: 'build/'
  },
  vendor: {
    src: 'src/assets/vendor/*.*',
    build: 'build/assets/vendor/'
  }
};

gulp.task('clean', function() {
  return del([paths.dist.dest, paths.styles.build, paths.scripts.build + '**/*.min.js']);
});

gulp.task('sass', function() {
  return gulp.src(paths.styles.src)
    .pipe(sass({
      outputStyle: 'compressed'
    }).on('error', sass.logError))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(gulp.dest(paths.styles.build))
    .pipe(browserSync.stream());
});

gulp.task('js', function() {
  return gulp.src(paths.scripts.src)
    .pipe(gulpif(prod, uglify()))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest(paths.scripts.dest))
    .pipe(gulp.dest(paths.scripts.build))
    .pipe(browserSync.stream());
});

gulp.task('html', function() {
  return gulp.src(paths.html.src)
    .pipe(gulpif(prod, htmlmin({
      collapseWhitespace: true
    })))
    .pipe(gulp.dest(paths.html.build));
});

gulp.task('jsvalidate', function() {
  return gulp.src(paths.scripts.src)
    .pipe(jshint())
    .pipe(jshint.reporter(stylish));
});

gulp.task('img', function() {
  return gulp.src(paths.images.src)
    .pipe(gulp.dest(paths.images.build));
});

gulp.task('fonts', function() {
  return gulp.src(paths.fonts.src)
    .pipe(gulp.dest(paths.fonts.build));
});

gulp.task('vendor', function() {
  return gulp.src(paths.vendor.src)
    .pipe(gulp.dest(paths.vendor.build));
});

gulp.task('watch', function() {
  gulp.watch(paths.styles.src, gulp.series('sass'));
  gulp.watch(paths.scripts.src, gulp.series('js'));
  gulp.watch(paths.html.src).on('change', browserSync.reload);
});

gulp.task('build', function(cb) {
  prod = true;
  gulpSequence('clean', ['sass', 'js', 'html', 'img', 'vendor', 'fonts'], cb);
});

gulp.task('serve', function() {
  browserSync.init({
    server: {
      baseDir: paths.dist.src
    },
    port: 8080,
    notify: true,
    open: true
  });
});

gulp.task('default', gulp.parallel('sass', 'js', 'serve', 'watch'));
