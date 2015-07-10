// inspire by https://github.com/jayphelps/sweet-async-await
macro go {
case {
  $_ { $body ... }
} => {
  return #{
    (function() {
      let (<!) = macro {
        rule infix { var $left:ident |  $right:expr $rest $[...] } => {
          return $right.take().then(function (value) {
            $left = value
            $rest $[...]
          })
        }
        
        rule infix { $left:expr |  $right:expr $rest $[...] } => {
          return $right.take().then(function (value) {
            $left = value
            $rest $[...]
          })
        }
      }
      $body ...
    })()
  };
}
}

go {
  b <! $.get('/posts');
  return JSON.parse(b.posts);
}

export go;
