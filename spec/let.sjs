fact 'Let' {
  fact 'init variables and return expr' {
    should let(a=1,b=2){a+b} => 3;
  }

  fact 'init variable the old way' {
    var a; a = 3;
    should a => 3;
  }

  fact 'init variable the old way' {
    var a = 3;
    should a => 3;
  }

  fact 'lexical scope' {
    var x = 5;
    var y = 0;

    let (x = 10+x, y = 12) {
      should x+y => 27
    };
    should x+y => 5
  }
}
