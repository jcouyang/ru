macro let {
  rule { ($($id = $val:expr)(,)...) {$body...$last:expr} } => {
    (function($($id)(,)...){
      $body...
        return $last;
    })($($val)(,)...)
  }

  rule { $id:ident } => { var $id }

}
export let;
