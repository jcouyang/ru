// inspire by https://github.com/jayphelps/sweet-async-await
macro go {
case {
  $_ { $body ... }
} => {
  return #{
    (function() {
      macroclass itemval {
        pattern {
          rule { $val:expr }
        }
        pattern {
          rule { $val:lit}
        }
        pattern {
          rule { $val:ident }
        }
      }

      let (<!) = macro {
        rule infix { var $left:ident |  $right:expr $rest $[...] } => {
          return mori.async.take$($right, function (value) {
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
      $body ...
    })()
  };
}
}

channel1 = mori.async.chan();

go {
  var b <! channel1;
  var c <! channel2;
  "asdf" >! channel1;
  somthing() >! channel2
  return JSON.parse(b.concat(a));
}

export go;
