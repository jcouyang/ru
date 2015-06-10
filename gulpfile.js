var gulp = require('gulp');
var sweetjs = require('gulp-sweetjs');
var jasmine = require('gulp-jasmine');
var fs = require('fs');

var macros = fs.readdirSync('macro').map(function(m){return './macro/'+m})

gulp.task('sweetify', function(){
  return gulp.src("spec/**/*.sjs")
    .pipe(sweetjs({
      modules: macros
    }))
    .pipe(gulp.dest('spec/build'))

})
gulp.task("spec", ['sweetify'], function() {
  return gulp.src("spec/build/**/*.js")
    .pipe(jasmine())
})
