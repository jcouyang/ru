var gulp = require('gulp');
var sweetjs = require('gulp-sweetjs');
var jasmine = require('gulp-jasmine');
var concat = require('gulp-concat');
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

gulp.task('concat', function() {
  return gulp.src(['./LICENSE.txt','./macro/*.sjs'])
    .pipe(concat('index.sjs'))
    .pipe(gulp.dest('./'))
})
