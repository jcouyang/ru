var gulp = require('gulp');
var sweetjs = require('gulp-sweetjs');
var jasmine = require('gulp-jasmine');

gulp.task('sweetify', function(){
  return gulp.src("spec/**/*.sjs")
    .pipe(sweetjs({
      modules: ['./macro/lambda','./macro/ruspec','./macro/defn']
    }))
    .pipe(gulp.dest('spec/build'))

})
gulp.task("spec", ['sweetify'], function() {
  return gulp.src("spec/build/**/*.js")
    .pipe(jasmine())
})
