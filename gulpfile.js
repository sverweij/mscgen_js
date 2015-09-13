var gulp = require('gulp'),
    p    = require('gulp-load-plugins')();

gulp.task('default', function() {
  gulp.start('styles');
});

gulp.task('styles', function() {
    return gulp.src('src/style/*.scss')
        .pipe(p.sass({outputStyle: 'compressed'})
                .on('error', p.sass.logError))
        // .pipe(p.autoprefixer('last 2 versions'))
        .pipe(gulp.dest('src/style'))
    ;
});

gulp.task('watch-styles', function() {
    gulp.watch('src/style/**/*.scss', function(pEvent){
        gulp.start('styles');
    });
});

gulp.task('watch', function() {
  gulp.start('watch-styles');
});
