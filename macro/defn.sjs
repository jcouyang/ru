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
        break
    }
  }
}
macro defn{
  rule { $name { $(($args (,) ...){$body ...})...} } => {
    function $name (){
        switch(arguments.length){
          $(caseFunc ($args...) {$body...})...
        }
    }
  }
}
export defn;
// defn arifunc {
//   (a, b){console.log('2 arity', a, b)}
//   (a) {console.log('1 arity', a)}
// }
