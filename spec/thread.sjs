fact 'thread' {
  fact 'as first argument' {
    should mori.vector('foo') -> [mori.conj('bar'), mori.get(0)] => 'foo'
  }

  fact 'as last argument' {
  should ('foo' ->> [mori.conj(mori.vector('bar')), mori.map(function(x){return x.toUpperCase()})]).toString() => '("BAR" "FOO")'
  }
}
