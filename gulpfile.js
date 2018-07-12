'use strict';

var gulp = require('gulp');
var gulp_sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var browser_sync = require('browser-sync').create();
var fontmin = require('gulp-fontmin');

gulp.task('cp-html', function () {
	gulp.src(['./html/*.html'])
	.pipe(gulp.dest('./public'))
	.pipe(browser_sync.stream());
});

gulp.task('cp-js', function () {
	gulp.src([
		'./theme/js/*.js',
		'./node_modules/bootstrap-datepicker/js/bootstrap-datepicker.js'
	])
	.pipe(gulp.dest('./public/theme/js'))
	.pipe(browser_sync.stream());
});

gulp.task('cp-img', function () {
	gulp.src(['./theme/images/*.png'])
	.pipe(gulp.dest('./public/theme/images'))
});

gulp.task('sass', function () {
	gulp.src(['./sass/*.scss'])
	.pipe(gulp_sass())
	// .pipe(sourcemaps.init())
	// .pipe(gulp_sass().on('error', gulp_sass.logError))
    // .pipe(gulp_sass({outputStyle: 'compressed'}).on('error', gulp_sass.logError))
	// .pipe(sourcemaps.write('./public/theme/css'))
	.pipe(gulp.dest('./public/theme/css'))
	.pipe(browser_sync.stream());
});

// gulp.task('cp-fonts', function () {
// 	gulp.src([
// 		'./theme/fonts/*.ttf'
// 	])
// 	.pipe(fontmin(
// 		{text: '天地玄黄 宇宙洪荒'}
// 	))
// 	.pipe(gulp.dest('./public/theme/fonts'))
// });


gulp.task('server', ['cp-html', 'sass', 'cp-js'], function() {
	browser_sync.init({
		server: {
			baseDir: "./public"
		}
	})
	gulp.watch('./html/*.html', ['cp-html']);
	gulp.watch('./sass/**', ['sass']);
	gulp.watch('./theme/js/*.js', ['cp-js']);
});

gulp.task('default', ['server', 'cp-img']);