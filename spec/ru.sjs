var mori = require('con.js')
fact '$ru' {
  fact 'expression' {
    should mori.equals($ru(map(inc, [0,1,2,3,4])), mori.vector(1,2,3,4,5)) => true
  }
}
fact '$chu' {
  fact 'expression' {
    should $chu(map(inc, [0,1,2,3,4])).pop() => 5
  }
}
