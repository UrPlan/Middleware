const gulp = require('gulp');
const ts = require('gulp-typescript');
const sourcemaps = require('gulp-sourcemaps');
const rimraf = require('rimraf')
const runSequence = require('run-sequence');
const nodemon = require("gulp-nodemon");

const tsProject = ts.createProject('tsconfig.json');

const TS_SRC = "./src/**/*.ts";

// Removes the ./build directory with all its content.
gulp.task('clean', function (callback) {
	rimraf("./build", callback);
});

// Compiles the typescript files and send the compiled files to the build folder
gulp.task('compile', function () {
	return gulp.src(TS_SRC)
		.pipe(sourcemaps.init())
		.pipe(tsProject())
		.pipe(sourcemaps.write(".", {
			sourceRoot: "../src"
		}))
		.pipe(gulp.dest("build"));
});

// Runs all required steps for the build in sequence.
gulp.task('build', function (callback) {
	runSequence('clean', 'compile', callback);
});

// Runs the build task and starts the server every time changes are detected.
gulp.task('watch', ['build'], function () {
	return nodemon({
		ext: "ts js json",
		script: "build/server.js",
		watch: ["src/*", "test/*"],
		tasks: ['build']
	});
});

// Default task
gulp.task('default', ['build']);