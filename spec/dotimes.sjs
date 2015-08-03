fact 'dotimes' {
  var a = 0;
  $dotimes(3){return a++}
  should a => 3
}
