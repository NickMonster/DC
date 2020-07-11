const gulp = require("gulp");
const concat = require("gulp-concat");
const sass = require("gulp-sass");
const cssmin = require("gulp-cssmin");
const plumber = require("gulp-plumber");
const notify = require("gulp-notify");
const del = require("del");

const jsFiles = ["./src/js/**/*"];

function img() {
  return gulp.src("./src/img/**/*").pipe(gulp.dest("./build/img/"));
}

// function fonts(){
//     return gulp.src('./src/fonts/**/*')
//     .pipe(gulp.dest('./build/fonts/'));
// }

function styles() {
  return gulp
    .src("./src/scss/styles.scss")
    .pipe(
      plumber({ errorHandler: notify.onError("Error: <%= error.message %>") })
    )
    .pipe(sass().on("error", sass.logError))
    .pipe(cssmin())
    .pipe(gulp.dest("./build/css/"));
}

function scripts() {
  return gulp
    .src(jsFiles, { allowEmpty: true })
    .pipe(concat("bundle.js"))
    .pipe(gulp.dest("./build/js"));
}

function clean(done) {
  done();
  return del(["build/**/*"], { forse: true });
}

function watch() {
  gulp.watch("./src/scss/**/*.scss", styles);
  gulp.watch("./src/js/**/*.js", scripts);
}

gulp.task("styles", styles);
gulp.task("del", clean);
gulp.task("watch", watch);
gulp.task("build", gulp.series(clean, gulp.parallel(styles, img, scripts)));
gulp.task("dev", gulp.series("build", "watch"));
