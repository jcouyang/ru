let into = macro {
case {_ ($to, $from...)} => {
  var value = #{$to}[0].token.value;
  letstx $content = #{$to}[0].token.inner
  if(value==='[]')
    return #{mori.into(mori.vector($content), $from...)}
  if(value==='{}')
    return #{mori.into(mori.hashMap($content), $from...)}
  else
    return #{mori.into($to, $from...)}
  }
}

export into;
// into([1],xfrom, [2,3,4])
// into(a,xfrom, [2,3,4])
