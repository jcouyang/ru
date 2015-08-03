fact '$defn' {
  fact '$defn w name' {
    $defn f {(a){a}};
    should f(1) => 1;
  }

  fact '$fn w/o name' {
    var f = $fn(a){a};
    should f(1) => 1;
  }

  fact '$defn arity func' {
    $defn f {
      (a){a}
      (a, b) {a+b}
    }
    should f(1) => 1;
    should f(2,3) => 5;
  }

  fact '$defn arity anomynous func' {
    var f = $fn {
      (a){a}
      (a, b) {a+b}
    }
    should f(1) => 1;
    should f(2,3) => 5;
  }

  fact 'with statements, final is expression' {
    var f = $fn(a){a=1;a};
    should f(2) => 1;
  }

  fact 'with all statements' {
    $defn f{(a){
      a=1;
      a}};
    should f(2) => 1;
  }

  fact 'recur function' {
    $defn f{(a,b){
      if(a>b) return a;
      recur(a++,b--)
    }}
    should f(1,36) => 19
  }
}
