// gulp basic config

const Gulp = require("gulp");
const Minifycss = require("gulp-minify-css");
const Uglify = require("gulp-uglify");
const Imagemin = require("gulp-imagemin");
const FileInclude = require("gulp-file-include");
const Watch = require("gulp-watch");
const WebServer = require("gulp-webserver");
const RunSequence = require("gulp-run-sequence");
const Clean = require("gulp-clean");

// css compile plugin
// const Sass = require("gulp-sass");

const Less = require("gulp-less");
const LessAutoprefix = require("less-plugin-autoprefix");
const autoprefix = new LessAutoprefix({ browsers: ["last 2 versions"] });

// todo babel used

const Dist = "build/example";

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

Gulp.task("copy-js", () => {
  Gulp.src("src/js/**")
    .pipe(Uglify())
    .pipe(Gulp.dest(Dist + "/js"));
});

// Gulp.task("Sass", () => {
//   Gulp.src("src/sass/*.scss")
//     .pipe(Sass().on("error", Sass.logError))
//     .pipe(Gulp.dest(Dist + "/sass"));
// });

Gulp.task("Less", () => {
  Gulp.src("./less/**/*.less")
    .pipe(
      Less({
        plugins: [autoprefix]
      })
    )
    .pipe(Gulp.dest(Dist + "/css"));
});

Gulp.task("copy-css", () => {
  Gulp.src("src/css/*.css")
    .pipe(Minifycss())
    .pipe(Gulp.dest(Dist + "/css"));
});

Gulp.task("copy-images", () => {
  // Gulp.src("src/images/*").pipe(Gulp.dest());
  Gulp.src("src/images/*")
    .pipe(Imagemin())
    .pipe(Gulp.dest(Dist + "/images"));
});

Gulp.task("watch", () => {
  Gulp.watch("src/view/*", ["copy-html"]);
  Gulp.watch("src/js/**", ["copy-js"]);
  Gulp.watch("src/css/*", ["copy-css"]);
  Gulp.watch("src/images/*", ["copy-images"]);
});

Gulp.task("copy-sources", ["copy-css", "copy-js", "copy-html", "copy-images"]);

Gulp.task("web-server", () => {
  Gulp.src(Dist).pipe(
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

Gulp.task("start", () => {
  // RunSequence是用来设置任务串行执行，因为有些任务是有先后顺序依赖，[]内的并行执行，()内的串行执行
  RunSequence("clean", ["copy-sources", "watch"], "web-server");
});

Gulp.task("default", ["start"]);
