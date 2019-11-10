// gulp basic config

const Gulp = require("gulp");
const Minifycss = require("gulp-minify-css");
const Uglify = require("gulp-uglify");
const Imagemin = require("gulp-imagemin");
const FileInclude = require("gulp-file-include");
const Watch = require("gulp-watch");
const WebServer = require("gulp-webserver");
// const RunSequence = require("gulp-run-sequence");
const RunSequence = require("gulp4-run-sequence");
const Clean = require("gulp-clean");

// css compile plugin
// const Sass = require("gulp-sass");

const Less = require("gulp-less");
const LessAutoprefix = require("less-plugin-autoprefix");
const autoprefix = new LessAutoprefix({ browsers: ["last 2 versions"] });

// todo babel used

const Dist = "dist/";

Gulp.task("copy-html", () => {
  return Gulp.src("src/view/*.html")
    .pipe(
      FileInclude({
        prefix: "##",
        basepath: "@file"
      })
    )
    .on("error", function(err) {
      console.error("Task:copy-html,", err.message);
      this.end();
    })
    .pipe(Gulp.dest(Dist));
});

Gulp.task("copy-js", done => {
  return (
    Gulp.src("src/js/**")
      // .pipe(Uglify())
      .pipe(Gulp.dest(Dist + "/js"))
  );
});

// Gulp.task("Sass", () => {
//   Gulp.src("src/sass/*.scss")
//     .pipe(Sass().on("error", Sass.logError))
//     .pipe(Gulp.dest(Dist + "/sass"));
// });

Gulp.task("Less", done => {
  return Gulp.src("scr/less/**/*.less")
    .pipe(
      Less({
        plugins: [autoprefix]
      })
    )
    .pipe(Gulp.dest(Dist + "/css"));
});

Gulp.task("copy-css", done => {
  return Gulp.src("src/css/*.css")
    .pipe(Minifycss())
    .pipe(Gulp.dest(Dist + "/css"));
});

Gulp.task("copy-images", done => {
  // Gulp.src("src/images/*").pipe(Gulp.dest());
  return Gulp.src("src/images/*")
    .pipe(Imagemin())
    .pipe(Gulp.dest(Dist + "/images"));
});

Gulp.task("watch", done => {
  // Gulp.watch("src/view/*", ["copy-html"]);
  // Gulp.watch("src/js/**", ["copy-js"]);
  // Gulp.watch("src/css/*", ["copy-css"]);
  // Gulp.watch("src/images/*", ["copy-images"]);
  done();
});

Gulp.task(
  "copy-sources",
  Gulp.series("copy-css", "copy-js", "copy-html", "copy-images", done => {
    console.log("the sources is finished");
    done();
  }),
  done => {
    done();
  }
);

Gulp.task("web-server", done => {
  return Gulp.src(Dist).pipe(
    WebServer({
      port: 3131,
      host: "localhost",
      livereload: true,
      open: "http://localhost:3131/index.html"
    })
  );
});

Gulp.task("clean", () => {
  return Gulp.src(Dist).pipe(Clean());
});

Gulp.task("start", done => {
  // RunSequence是用来设置任务串行执行，因为有些任务是有先后顺序依赖，[]内的并行执行，()内的串行执行
  RunSequence("clean", ["copy-sources", "watch"], "web-server");
  done();
});

Gulp.task("default", Gulp.series("start"), done => {
  done();
});
