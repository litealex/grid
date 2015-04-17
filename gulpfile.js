var gulp = require('gulp'),
    less = require('gulp-less'),
    browserify = require('gulp-browserify'),
    concat = require('gulp-concat');

gulp.task('browserify', function () {
    gulp.src('./src/js/app.js')
        .pipe(browserify({transform: 'reactify'}))
        .pipe(concat('grid.js'))
        .pipe(gulp.dest('dist/js'))
});

gulp.task('copy', function () {
    gulp.src('src/index.html')
        .pipe(gulp.dest('dist'));
});

gulp.task('less', function(){
    gulp.src('src/less/*.less')
        .pipe(less())
        .pipe(concat('styles.css'))
        .pipe(gulp.dest('dist/css'));
});

gulp.task('default', ['browserify', 'copy', 'less']);

gulp.task('watch', function () {
    gulp.watch('src/**/*.*', ['default']);
})