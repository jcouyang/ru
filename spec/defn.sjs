fact 'defn' {
  fact 'defn w name' {
    defn f {(a){return a}};
    should f(1) => 1;
  }

  fact 'defn w/o name' {
    var f = defn {(a){return a}};
    should f(1) => 1;
  }
}
