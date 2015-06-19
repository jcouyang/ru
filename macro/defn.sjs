macro caseFunc {
  case {_ ($args...) {$body... recur($binding:expr(,)...)}} =>
    {
      letstx $len = [makeValue(#{$args...}.length , null)];
      return #{
      case $len:
        return (function($args...){
          while(true){
            $body...;
            $binding(;)...
          }
        }).apply(this, arguments)
      }
    }
  
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
  rule { $name { $(($args (,) ...){$body... recur ($binding:expr(,)...)})...} } => {
    function $name (){
      switch(arguments.length){
        $(caseFunc ($args...) {$body... recur($binding(,)...)};
         )...
      }
    }
  }

  
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
// defn f{(a,b){
//   if(a===b) return a
//   recur(a++,b--)
// }}
