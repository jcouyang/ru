macro fn {
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

// fn($+$2+$1+$5+($5+$1))
export fn;
