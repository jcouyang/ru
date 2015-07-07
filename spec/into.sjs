mori = require('mori')
fact 'into' {
  fact 'array' {
    should mori.equals($into([0],[1,2,3,4]), mori.vector(0,1,2,3,4)) => true
  }
}
