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
  rule {($params...){$body... $recur($binding:expr(,)...)}} => {
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
