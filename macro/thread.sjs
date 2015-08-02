macroclass any {
  pattern {
    rule { $val:expr }
  }
  pattern {
    rule { $val:lit }
  }
  pattern {
    rule { $val:ident }
  }
}
macro (->) {

  rule infix {
    $val:expr| [$id:ident(.)... () ]
  } => {
    $id(.)... $val
  }
  
  rule infix {
    $val:expr| [$id:ident(.)... ($args:expr (,)...) ]
  } => {
    $id(.)... ($val, $args(,)...)
  }
  
  rule infix {
    $val:expr| [$id:ident(.)...]
  } => {
    $id(.)... $val
  }
  rule infix {
    $val:expr|  [$id:ident(.)..., $rest...]
  } => {
    ($id(.)... $val) -> [$rest...]
  }
  
  rule infix {
    $val:expr|  [$id:ident(.)... () , $rest...]
  } => {
    ($id(.)... $val) -> [$rest...]
  }
  
  rule infix {
    $val:expr|  [$id:ident(.)... ($args:expr(,)...) , $rest...]
  } => {
    ($id(.)... ($val, $args(,)...)) -> [$rest...]
  }
}


export (->)

// mori.vector('foo') -> [mori.conj('bar'), mori.map(function(x){return x.toUpperCase()})];

macro (->>) {

  rule infix {
    $val:expr| [$id:ident(.)... () ]
  } => {
    $id(.)... $val
  }
  
  rule infix {
    $val:expr| [$id:ident(.)... ($args:expr(,)...) ]
  } => {
    $id(.)... ($args(,)... , $val)
  }
  
  rule infix {
    $val:expr| [$id:ident(.)...]
  } => {
    $id(.)... $val
  }
  rule infix {
    $val:expr|  [$id:ident(.)..., $rest...]
  } => {
    ($id(.)... $val) ->> [$rest...]
  }
  
  rule infix {
    $val:expr|  [$id:ident(.)... () , $rest...]
  } => {
    ($id(.)... $val) ->> [$rest...]
  }
  
  rule infix {
    $val:expr|  [$id:ident(.)... ($args:expr(,)...) , $rest...]
  } => {
    ($id(.)... ($args(,)..., $val)) ->> [$rest...]
  }
}

export (->>)
