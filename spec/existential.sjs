fact 'Existential' {
  fact '?=' {
    var a = 0;
    a ?= 100;
    should a => 100
  }

  fact '?.' {
    var a= {b:2};
    a?.b?.c = 1
    should typeof a.b.c => 'undefined'
  }

  fact '?()' {
    fact 'null'{
      var a = {b:null};
      should a.b?() => undefined  
    }
    fact 'not nil' {
      var a = {b:null};
      a.b =fn(5);
      should a.b?() => 5
    }
  }
}
