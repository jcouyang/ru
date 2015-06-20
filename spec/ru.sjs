mori = require('mori')
fact 'ru' {
  fact 'array' {
    should mori.equals(ru(vector(0,1,2,3,4)), mori.vector(0,1,2,3,4)) => true
  }
  fact 'expression' {
    should mori.equals(ru(map(inc, [0,1,2,3,4])), mori.vector(1,2,3,4,5)) => true
  }
}
fact 'chu' {
  fact 'array' {
    should chu(vector(0,1,2,3,4))[3] => 3
  }
  fact 'expression' {
    should chu(map(inc, [0,1,2,3,4])).pop() => 5
  }
}
