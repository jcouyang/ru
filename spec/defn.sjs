fact 'defn' {
  fact 'defn w name' {
    defn f {(a){a}};
    should f(1) => 1;
  }

  fact 'defn w/o name' {
    var f = defn {(a){a}};
    should f(1) => 1;
  }

  fact 'defn arity func' {
    defn f {
      (a){a}
      (a, b) {a+b}
    }
    should f(1) => 1;
    should f(2,3) => 5;
  }

  fact 'with statements, final is expression' {
    var f = defn {(a){a=1;a}};
    should f(2) => 1;
  }

  fact 'with all statements' {
    defn f{(a){
      a=1;
      a;}};
    should f(2) => 1;
  }
  fact 'defn function with arrow expr' {
    defn f {
      a=>a
      a, b => a+b
    };
    should f(1) => 1;
    should f(1,3) => 4;
  }
}
