"use strict";

/**
 * Required
 */
var gulp = require('gulp'),
	uglify = require('gulp-uglify'),
	gulpSass = require('gulp-sass'),
	plumber = require('gulp-plumber'),
	browserSync = require('browser-sync'),
	reload = browserSync.reload,
	autoprefixer = require('gulp-autoprefixer'),
	sourcemaps = require('gulp-sourcemaps'),
	del = require('del'),
	rename = require('gulp-rename');

/**
 * Scripts Task
 */
gulp.task('scripts', function(){
	gulp.src(['app/js/**/*.js','!app/js/**/*.min.js'])
		.pipe(plumber())
		.pipe(rename({suffix:'.min'}))
		.pipe(uglify())
		.pipe(gulp.dest('app/js'))
		.pipe(reload({stream:true}));
});


/**
 * SASS Task
 */
gulp.task('sass', function () {
	return gulp.src('app/scss/**/*.scss')
 	.pipe(plumber())
 	.pipe(sourcemaps.init())
   	.pipe(gulpSass({outputStyle: 'compressed'}).on('error', gulpSass.logError))
   	.pipe(autoprefixer('last 2 versions'))
   	.pipe(sourcemaps.write('.'))
   	.pipe(gulp.dest('app/css'))
   	.pipe(reload({stream:true}))
});

/**
 * HTML Task
 */
gulp.task('html', function(){
	gulp.src('app/**/*.html')
		.pipe(reload({stream:true}));
});

/**
 * Build Task
 */

// clear out all files and folders from build folder
gulp.task('build:cleanfolder', function(){
	del([
		'build/**'
	]);
});

// task to create build directory for all files
gulp.task('build:copy', ['build:cleanfolder'], function(){
	return gulp.src('app/**/*')
	.pipe(gulp.dest('build/'));
});

// remove all unwanted files in the build directory
gulp.task('build:remove', ['build:copy'], function(){
	del([
		'build/scss',
		'build/js/!(*min.js)'
	]);
});

gulp.task('build', ['build:copy','build:remove']);

/**
 * Browser-Sync Task
 */
gulp.task('browser-sync', function(){
	browserSync({
		server:{
			baseDir: "./app/"
		}
	});
});

// run build server for testing final app
gulp.task('buid:serve', function(){
	browserSync({
		server:{
			baseDir: "./build/"
		}
	});
});

/**
 * Watch Task
 */
gulp.task('watch', function(){
	gulp.watch('app/js/**/*.js', ['scripts']);
	gulp.watch('app/scss/**/*.scss', ['sass']);
	gulp.watch('app/**/*.html', ['html']);
});

/**
 * Default Task
 */
 gulp.task('default', ['scripts','sass','html', 'browser-sync', 'watch']);