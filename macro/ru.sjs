macro morize {
case {_ ($param:expr)} => {
  var MORI_KEYWORDS = ["sortBy", "partial", "isIndexed", "map", "zipmap", "compare", "seq", "isSubset", "range", "into", "isMap", "peek", "mergeWith", "isSymbol", "rename", "reduceKV", "list", "constantly", "isCollection", "fnil", "isReversible", "lazySeq", "next", "transduce", "keys", "lt", "subvec", "isEven", "keep", "index", "find", "partitionBy", "dissoc", "mapIndexed", "every", "sortedSet", "resetMeta", "sum", "pop", "reverse", "hash", "queue", "repeat", "project", "dedupe", "second", "iterate", "union", "isSequential", "nth", "configure", "comp", "partition", "isSuperset", "isReduceable", "eduction", "getIn", "take", "isList", "rest", "isVector", "count", "gt", "cons", "sort", "keepIndexed", "apply", "gte", "completing", "distinct", "alterMeta", "dropWhile", "isOdd", "sequence", "drop", "isSet", "sortedMapBy", "vals", "inc", "renameKeys", "vector", "identity", "keyword", "remove", "interleave", "mapcat", "varyMeta", "sortedSetBy", "concat", "filter", "symbol", "isKeyword", "empty", "intersection", "mutable", "selectKeys", "isCounted", "pipeline", "curry", "subseq", "sortedMap", "updateIn", "last", "interpose", "groupBy", "takeWhile", "conj", "meta", "each", "intoArray", "join", "isSeqable", "withMeta", "lte", "takeNth", "set", "some", "primSeq", "juxt", "isEmpty", "notEquals", "isSeq", "reduce", "knit", "flatten", "repeatedly", "hasKey", "assoc", "mapInvert", "hashMap", "dec", "disj", "assocIn", "difference", "get", "merge", "equals", "isAssociative", "first", "partitionAll"];
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
macro ru {
rule { ($param:expr)}=>{
    mori.toClj(morize($param))
}
}
export ru;
// ru(map(inc, [1,2,3]))
let into = macro {
case {_ ($to, $from...)} => {
  var value = #{$to}[0].token.value;
  letstx $content = #{$to}[0].token.inner
  if(value==='[]')
    return #{ru(into(vector($content), $from...))}
  if(value==='{}')
    return #{ru (into(hashMap($content), $from...))}
  else
    return #{ru(into($to, $from...))}
  }
}

export into;
into([0],[1,2,3,4])

macro chu {
  rule { ($mori:expr) } => {
    mori.toJs(morize($mori))
  }
}
export chu;
chu(map(fn(a([0],$)),[1,2,3]))
