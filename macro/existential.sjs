macro (?) {
  rule infix {$left:expr | $right... } => {
    (function(){
      if(typeof $left!=='undefined' && $left!==null){
        return $left $right...
      }
    })()
  }
}

export (?)

// a ?= 100



