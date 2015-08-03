fact 'cond' {
  should $cond{
    (1==2){return 1}
    (2==2){return 2}
    (3==2){return 3}
  } => 2
}
