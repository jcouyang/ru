//var macro from http://jlongster.com/Sweet.js-Tutorial--2--Recursive-Macros-and-Custom-Pattern-Classes
macro destruct_array {
  rule { $obj $i [] } => {}

  rule { $obj $i [ $var:ident = $init:expr, $pattern ... ] } => {
    var $var = $obj[$i++] || $init;
    destruct_array $obj $i [ $pattern ... ]
  }

  rule { $obj $i [ $var:ident, $pattern ... ] } => {
    var $var = $obj[$i++];
    destruct_array $obj $i [ $pattern ... ]
  }
}

let var = macro {
  rule { [ $pattern ...] = $obj:expr } => {
    var arr = $obj;
    var i = 0;
    destruct_array arr i [ $pattern ... , ]
  }

  rule { $id } => {
    var $id
  }
}

macro case_param {
  rule {$len ($args...) $body} => {
    case $len:
        var [$args (,)...] = arguments
        $body
  }
}
macro caseFunc {
case {_ ($args...) {$body...}} =>
    {
      letstx $len = [makeValue(localExpand(#{$args...}).length , null)];
    return #{
      case_param $len ($args...) $body...
    }
  }
}
macro defn{
  rule { $name { $(($args (,) ...){$body ... $last:expr $[;]})...} } => {
    function $name (){
      switch(arguments.length){
        $(caseFunc ($args...) {$body...};
          return $last;
          break;
         )...
      }
    }
  }


  rule { $name { $(($args (,) ...){$body ... $last:expr})...} } => {
    function $name (){
        switch(arguments.length){
          $(caseFunc ($args...) {$body...};
            return $last;
            break;
           )...
        }
    }
  }


  rule { { $(($args (,) ...){$body ...  $last:expr})...} } => {
    (function (){
        switch(arguments.length){
          $(caseFunc ($args...) {$body...};
            return $last;
            break;
           )...
        }
    })
  }

  rule { { $(($args (,) ...){$body ...  $last:expr;})...} } => {
    (function (){
      switch(arguments.length){
        $(caseFunc ($args...) {$body...};
          return $last;
          break;
         )...
      }
    })
  }

  rule { $name { $($args (,) ... => $body:expr)...} } => {
    function $name (){
        switch(arguments.length){
          $(caseFunc ($args...) {};
           return $body)...
        }
    }
  }
}
export defn;
