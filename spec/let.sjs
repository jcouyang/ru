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

  fact 'destructure array' {
    should let([x,y]=[1,2,3], [z] = [4,5,6]){
      x+y+z
    } => 7
  }

  fact 'destructure nested array' {
    should let([x,[y]]=[1,[2,4],3], [z] = [4,5,6]){
      x+y+z
    } => 7
  }

  fact 'looprecur' {
    should loop(a=1,b=18){
      if (a > b)
        return a
      recur (a++,b--)
    }
      => 10
  }
}
