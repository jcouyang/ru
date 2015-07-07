/**
The MIT License (MIT)

Copyright (c) 2015 Jichao Ouyang

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

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
export $defn;
// $defn f{(a,b){
//   if(a===b) return a
//   recur(a++,b--)
// }}

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

$$($+$2+$1+$5+($5+$1))
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

$let([x,[y]]=[1,[2,4],3], [z] = [4,5,6]){
      x+y+z
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
    mori.toClj(morize($param))
}
}
export $ru;
$ru(map(inc, [1,2,3]))
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


$into([0],[1,2,3,4])

export $into;

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
    describe($name, function(){$body...})
  }
}

macro should {

  rule {
    $actual... => $expect:expr
  } => {
    (it('',function(){expect($actual...).toBe($expect)}))
  }
}

macro shouldnot {
    rule {
    $actual:expr => $expect:expr
  } => {
    (it('',function(){expect($actual).not.toBe($expect)}))
  }

  rule {
    $name:lit $actual:expr => $expect:expr
  } => {
    (it($name,function(){expect($actual).not.toBe($expect)}))
  }
}

export fact;
export should;
export shouldnot;
