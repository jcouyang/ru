// inspire by https://github.com/jayphelps/sweet-async-await
macro go {
case {
  $_ { $body ... }
} => {
  return #{
    (function() {

      let (<!) = macro {
        rule infix { var $left:ident |  $right:expr $rest $[...] } => {
          return mori.async.take$($right, function (value) {
            $left = value
            $rest $[...]
          })
        }
        
        rule infix { $left:expr |  $right:expr $rest $[...] } => {
          return mori.async.take$($right, function (value) {
            $left = value
            $rest $[...]
          })
        }
      }

      let (>!) = macro {
        rule infix { $left:expr |  $right:expr $rest $[...] } => {
          return mori.async.put$($right, $left, function () {
            $rest $[...]
          })
        }

        rule infix { $left:lit |  $right:expr $rest $[...] } => {
          return mori.async.put$($right, $left, function () {
            $rest $[...]
          })
        }

        rule infix { $left:ident |  $right:expr $rest $[...] } => {
          return mori.async.put$($right, $left, function () {
            $rest $[...]
          })
        }
      }

      let (<!alts) = macro {
        rule infix { var $left:ident |  $right:expr $rest $[...] } => {
          return mori.async.doAlts(function (value) {
            $left = value
            $rest $[...]
          }, $right)
        }
        
        rule infix { $left:expr |  $right:expr $rest $[...] } => {
          return mori.async.doAlts(function (value) {
            $left = value
            $rest $[...]
          }, $right)
        }
      }
      $body ...
    })();
  }
}
}

export go;


macro goLoop {
  rule { ($key:ident=$val:expr (,) ...){$body ... recur($bindings...)}}  => {
    go {
      (function loop($val(,)...){
        $body...
          loop(a)
      })($val(,)...)
    };
  }
}

export goLoop;

goLoop(a=1){
  v <! chan()
  recur(a++)
}
