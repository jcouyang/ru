fact 'if-let' {
  should $iflet(a=1){return a+2} => 3
  should $iflet(a=0){return a+2} => undefined
}

fact 'if-some' {
  should $ifsome(a=0){return a+2} => 2
  should $ifsome(a=null){return a+2} => undefined
}
