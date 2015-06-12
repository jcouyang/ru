//var macro from http://jlongster.com/Sweet.js-Tutorial--2--Recursive-Macros-and-Custom-Pattern-Classes
macro caseFunc {
    case {_ ($args...) {$body... $last:expr}} =>
    {
      letstx $len = [makeValue(#{$args...}.length , null)];
      return #{
      case $len:
        return (function($args...){$body... return $last}).apply(this, arguments)
      }
    }
}

macro defn{
  rule { $name { $(($args (,) ...){$body ...})...} } => {
    function $name (){
      switch(arguments.length){
        $(caseFunc ($args...) {$body...};
         )...
      }
    }
  }

  rule { { $(($args (,) ...){$body ...})...} } => {
    (function (){
        switch(arguments.length){
          $(caseFunc ($args...) {$body...};
           )...
        }
    })
  }
}
export defn;
