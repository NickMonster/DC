const gulp = require("gulp");
const concat = require("gulp-concat");
const sass = require("gulp-sass");
const cssmin = require("gulp-cssmin");
const plumber = require("gulp-plumber");
const notify = require("gulp-notify");
const del = require("del");
const browserSync = require("browser-sync").create();

const jsFiles = ["./src/js/**/*"];

function img() {
  return gulp
    .src("./src/img/**/*")
    .pipe(gulp.dest("./build/img/"))
    .pipe(browserSync.stream());
}

function fonts() {
  return gulp
    .src("./src/fonts/**/*")
    .pipe(gulp.dest("./build/fonts/"))
    .pipe(browserSync.stream());
}

function styles() {
  return gulp
    .src("./src/scss/styles.scss")
    .pipe(
      plumber({ errorHandler: notify.onError("Error: <%= error.message %>") })
    )
    .pipe(sass().on("error", sass.logError))
    .pipe(cssmin())
    .pipe(gulp.dest("./build/css/"))
    .pipe(browserSync.stream());
}

function scripts() {
  return gulp
    .src(jsFiles, { allowEmpty: true })
    .pipe(concat("bundle.js"))
    .pipe(gulp.dest("./build/js"))
    .pipe(browserSync.stream());
}

function clean(done) {
  done();
  return del(["build/**/*"], { forse: true });
}

function html() {
  return gulp
    .src("./src/*.html")
    .pipe(
      plumber({ errorHandler: notify.onError("Error: <%= error.message %>") })
    )
    .pipe(gulp.dest("./build/"))
    .pipe(browserSync.stream());
}

function watch() {
  browserSync.init({
    server: {
      baseDir: "./build/",
    },
  });
  gulp.watch("./src/scss/**/*.scss", styles);
  gulp.watch("./src/js/**/*.js", scripts);
  gulp
    .watch("./src/**/*.html", gulp.series(html))
    .on("change", browserSync.reload);
}

gulp.task("styles", styles);
gulp.task("del", clean);
gulp.task("watch", watch);
gulp.task(
  "build",
  gulp.series(clean, gulp.parallel(styles, html, fonts, img, scripts))
);
gulp.task("dev", gulp.series("build", "watch"));
