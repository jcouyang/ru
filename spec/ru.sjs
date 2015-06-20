mori = require('mori')
fact 'into' {
  fact 'array' {
    should mori.equals(ru(vector(0,1,2,3,4)), mori.vector(0,1,2,3,4)) => true
  }
  fact 'expression' {
    should mori.equals(ru(map(inc, [0,1,2,3,4])), mori.vector(1,2,3,4,5)) => true
  }
}
