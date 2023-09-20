const gulp = require("gulp");
const htmlmin = require("gulp-htmlmin");
const cleanCSS = require("gulp-clean-css");
const uglify = require("gulp-uglify");
const concat = require("gulp-concat");
const replace = require("gulp-replace");
const browserSync = require("browser-sync").create();

// Paths used throughout the file
const paths = {
    src: {
        html: "src/*.html",
        css: "src/css/*.css",
        js: "src/js/*.js",
    },
    dist: {
        root: "dist/",
        css: "dist/css/",
        js: "dist/js/",
    },
};

// HTML Task
function html() {
    return gulp
        .src(paths.src.html)
        .pipe(replace('src="js/script.js"', 'src="js/bundle.js"')) // Update script tag src to bundle.js
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest(paths.dist.root));
}

// CSS Task
function css() {
    return gulp.src(paths.src.css).pipe(cleanCSS()).pipe(gulp.dest(paths.dist.css));
}

// JavaScript Task
function js() {
    return gulp.src(paths.src.js).pipe(concat("bundle.js")).pipe(uglify()).pipe(gulp.dest(paths.dist.js));
}

// Serve and watch for changes
function serve(cb) {
    browserSync.init({
        server: paths.dist.root,
    });
    cb();
}

function watching() {
    gulp.watch(paths.src.html, gulp.series(html));
    gulp.watch(paths.src.css, gulp.series(css));
    gulp.watch(paths.src.js, gulp.series(js));
}


// Default task
const defaultTask = gulp.series(gulp.parallel(html, css, js), serve, watching);

exports.default = defaultTask;
exports.html = html;
exports.css = css;
exports.js = js;
exports.serve = serve;
