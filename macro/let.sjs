macro let {
  rule { ($($id = $val)(,)...) {$body...$last:expr} } => {
    (function($($id)(,)...){
      $body...
        return $last;
    })($($val)(,)...)
  }
}
export let;
