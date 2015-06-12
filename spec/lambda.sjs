fact 'lambda' {
  fact 'without place holder' {
    should fn(1+3)('foo') => 4
  }

  fact 'with place holder' {
    should [1,2,3,4].reduce(fn($+$2),0) => 10
  }

  fact 'place holder in reverse order' {
    should fn($3+$2*$1)(1, 2, 3) =>  5
  }

  fact 'duplicated place holder' {
    should fn($1+$+$2+$2)(1, 2, 3) => 6
  }
}
