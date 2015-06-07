var gulp = require('gulp');
var sweetjs = require('gulp-sweetjs');
var jasmine = require('gulp-jasmine');

gulp.task('sweetify', function(){
  gulp.src("spec/**/*.sjs")
    .pipe(sweetjs({
      modules: ['./macro/ruspec','./macro/defn']
    }))
    .pipe(gulp.dest('spec/build'))

})
gulp.task("spec", ['sweetify'], function() {
  gulp.src("spec/build/**/*.js")
    .pipe(jasmine())
})
