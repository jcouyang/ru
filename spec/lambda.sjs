fact 'lambda' {
  fact 'with place holder' {
    should [1,2,3,4].reduce(fn($+$2),0) => 10;
  }
}
