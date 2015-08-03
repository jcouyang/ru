macro $iflet {
  rule { ($($binding:ident=$val:expr) (,)...) {$body...}} => {
    $let($($binding=$val)...){
      if($binding (&&) ...){
        $body...
      }
    }
  }
}
export $iflet;

macro $ifsome {
  rule { ($($binding:ident=$val:expr) (,)...) {$body...}} => {
    $let($($binding=$val)...){
      if($($binding!=null) (&&) ...){
        $body...
      }
    }
  }
}
export $ifsome;
