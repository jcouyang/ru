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
  rule { ($($key:ident=$val:expr) (,) ...){$body ... recur($bindings...)}}  => {
    go {
      (function loop($key(,)...){
        $body...
          loop($bindings...)
      })($val(,)...)
    };
  }
}

export goLoop;

macro _cond {

  rule { {else $body...}} => {
    $body...
  }
  
  rule {
    {($test...){$body...} $rest...}
  }=> {
    if($test...){
      $body...
    }else _cond{$rest...}
  }

  rule {} => {}
}

macro $cond {
  rule {
    {$body...}
  } => {
    (function(){
      _cond{$body...}
    })()
  }
}

export $cond

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

macro $defn{
  rule { $name($args...){$body...} } => {
    var $name = $fn{($args...){$body...}};
  }

  
  rule { $name { $body... } } => {
    var $name = $fn{$body...};
  }
}

macro $fn {
  rule {{ $(($args (,) ...){$body... recur ($binding:expr(,)...)})...} } => {
    (function(){
      switch(arguments.length){
        $(caseFunc ($args...) {$body... recur($binding(,)...)};
         )...
      }
    });
  }
  
  rule { { $(($args (,) ...){$body ...})...} } => {
    (function (){
        switch(arguments.length){
          $(caseFunc ($args...) {$body...};
           )...
        }
    });
  }

  rule { ($args...){$body...} } => {
    $fn{($args...){$body...}};
  }
}

export $defn;
export $fn;
// $defn f{(a,b){
//   if(a===b) return a
//   recur(a++,b--)
// }}

macro $dotimes {
  rule {
    ($n:expr) {$body...}
  } => {
      for(var i=0;i<$n;i++){
        $body...
      };
  }
}

export $dotimes;

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




macro $iflet {
  rule { ($($binding:ident=$val:expr) (,)...) {$body...}} => {
    $let($($binding=$val)...){
      if($binding (&&) ...){
        $body...
      }
    }
  }
}
export $iflet;

macro $ifsome {
  rule { ($($binding:ident=$val:expr) (,)...) {$body...}} => {
    $let($($binding=$val)...){
      if($($binding!=null) (&&) ...){
        $body...
      }
    }
  }
}
export $ifsome;

macro $$ {
case {
  $ctx
  ($body:expr)
}=>{
  function replace_args(stxs){
    return stxs.map(function(x){
      if(x.token.inner) {x.token.inner = replace_args(x.token.inner); return x}
      if(x.token.type==parser.Token.Identifier && x.token.value.match(/^\$(\d?)$/)){
        var num = x.token.value.match(/^\$(\d?)$/).pop()
        if(!num) num=1;
        return makeIdent('arguments['+(num-1)+']',#{$body});
      }
      return x;
    })
  }
  var body = replace_args(#{$body})
  letstx $new_body = body
  return #{
    (function(){return $new_body})}
}
}

export $$;

macro destruct {
  // empty
  rule {[]=$val:expr} => {}
  //not destructable
  rule {$id:ident=$val:expr} => {$id=($val)}
  // one
  rule {[$id:ident]=$val:expr} => { $id=($val[0]) }
  // nested one
  rule {[[$id]]=$val:expr} => { destruct [$id]=($val[0]) }
  // tail
  rule { [,$last:ident]=$val:expr}=>{$last=($val[0])}
  rule { [,[$last]]=$val:expr}=>{destruct [$last]=($val[0])}
  rule {[, $id:ident $tail...]=$val:expr}=> {destruct $id=($val.shift()), destruct [$tail...]=$val.slice(1)}
  //whole
  rule {[$id:ident $tail...]=$val:expr} => {destruct $id=($val.shift()), destruct [$tail...]=$val.slice(1)}
}

macro $let { 
case {_ ($($param:invoke(destruct)) (,)...){$body:expr...$last:expr} } => {
    var param = localExpand(#{$param...});
    var keys=[],vals=[]
    while(param.length>0){
      keys.push(param.shift());
      param.shift();
      vals.push(param.shift());
      if(param[0] && param[0].token.type === parser.Token.Punctuator){
        param.shift();
      }
      vals.push(makePunc(',',#{here}));
      keys.push(makePunc(',',#{here}));
    }
    vals.pop();keys.pop();
    return [makeDelim('()', [
    makeKeyword('function', #{_}),
    makeDelim('()', keys, #{$param...}[0]),
      makeDelim('{}', #{$body... ;return $last}, #{_})],#{_}),
    makeDelim('()',vals,#{_})]
}
  case {_ ($($param:invoke(destruct)) (,)...){$body...} } => {
    var param = localExpand(#{$param...});
    var keys=[],vals=[]
    while(param.length>0){
      keys.push(param.shift());
      param.shift();
      vals.push(param.shift());
      if(param[0] && param[0].token.type === parser.Token.Punctuator){
        param.shift();
      }
      vals.push(makePunc(',',#{here}));
      keys.push(makePunc(',',#{here}));
    }
    vals.pop();keys.pop();
    return [makeDelim('()', [
    makeKeyword('function', #{_}),
    makeDelim('()', keys, #{$param...}[0]),
      makeDelim('{}', #{$body... }, #{_})],#{_}),
    makeDelim('()',vals,#{_})]
  }
  rule { $id:ident } => { var $id }
}

export $let

macro $loop {
  rule {($params...){$body... recur($binding:expr(,)...)}} => {
    $let($params...){
      while (true) {
        $body...;
          $binding(;)...
      }
    }
  }
}
export $loop

// loop(a=1,b=18){
//   if (a > b)
//     return a
//   recur (a++,b--)
// }

operator (>>=) 12 left { $l, $r } => #{$l.then($r) }
export (>>=)

macro morize {
case {_ ($param:expr)} => {
  var MORI_KEYWORDS = ["sortBy", "partial", "isIndexed", "map", "zipmap", "compare", "seq", "isSubset", "range", "$into", "isMap", "peek", "mergeWith", "isSymbol", "rename", "reduceKV", "list", "constantly", "isCollection", "fnil", "isReversible", "lazySeq", "next", "transduce", "keys", "lt", "subvec", "isEven", "keep", "index", "find", "partitionBy", "dissoc", "mapIndexed", "every", "sortedSet", "resetMeta", "sum", "pop", "reverse", "hash", "queue", "repeat", "project", "dedupe", "second", "iterate", "union", "isSequential","into", "nth", "configure", "comp", "partition", "isSuperset", "isReduceable", "eduction", "getIn", "take", "isList", "rest", "isVector", "count", "gt", "cons", "sort", "keepIndexed", "apply", "gte", "completing", "distinct", "alterMeta", "dropWhile", "isOdd", "sequence", "drop", "isSet", "sortedMapBy", "vals", "inc", "renameKeys", "vector", "identity", "keyword", "remove", "interleave", "mapcat", "varyMeta", "sortedSetBy", "concat", "filter", "symbol", "isKeyword", "empty", "intersection", "mutable", "selectKeys", "isCounted", "pipeline", "curry", "subseq", "sortedMap", "updateIn", "last", "interpose", "groupBy", "takeWhile", "conj", "meta", "each", "intoArray", "join", "isSeqable", "withMeta", "lte", "takeNth", "set", "some", "primSeq", "juxt", "isEmpty", "notEquals", "isSeq", "reduce", "knit", "flatten", "repeatedly", "hasKey", "assoc", "mapInvert", "hashMap", "dec", "disj", "assocIn", "difference", "get", "merge", "equals", "isAssociative", "first", "partitionAll"];
  function addMori(param){
    return param.map(function(p){
      
      if(p.token.inner) p.token.inner = addMori(p.token.inner)
      if(p.token.type===parser.Token.Identifier && MORI_KEYWORDS.indexOf(p.token.value)>=0){
        return makeIdent('mori.'+p.token.value, p)
      }else{
        return p
      }
    })
  }
  return addMori(#{$param})
}
  
}

// morize(map(inc,[1,2,3]))
macro $ru {
rule { ($param:expr)}=>{
  mori.extra.toClj(morize($param))
}
}
export $ru;
macro $into {
case {_ ($to, $from...)} => {
  var value = #{$to}[0].token.value;
  letstx $content = #{$to}[0].token.inner
  if(value==='[]')
    return #{$ru(into(vector($content), $from...))}
  if(value==='{}')
    return #{$ru(into(hashMap($content), $from...))}
  else
    return #{$ru(into($to, $from...))}
  }
}


macro $chu {
  rule { ($mori:expr) } => {
    mori.toJs(morize($mori))
  }
}
export $chu;
// $chu(map(fn(a([0],$)),[1,2,3]))

macro fact {
  rule {
    $name {$body...}
  } => {
    describe($name, function(){$body...});
  }
}

macro should {

  rule {
    $actual... => $expect:expr
  } => {
    it('',function(){expect($actual...).toBe($expect)});
  }
}

macro shouldnot {
    rule {
    $actual:expr => $expect:expr
  } => {
    it('',function(){expect($actual).not.toBe($expect)});
  }

  rule {
    $name:lit $actual:expr => $expect:expr
  } => {
    it($name,function(){expect($actual).not.toBe($expect)});
  }
}

export fact;
export should;
export shouldnot;

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
