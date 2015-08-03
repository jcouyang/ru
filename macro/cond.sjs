macro _cond {

  rule { {else $body...}} => {
    $body...
  }
  
  rule {
    {($test...){$body...} $rest...}
  }=> {
    if($test...){
      $body...
    }else _cond{$rest...}
  }

  rule {} => {}
}

macro $cond {
  rule {
    {$body...}
  } => {
    (function(){
      _cond{$body...}
    })()
  }
}

$cond {
  (0){1}
  (1){2}
}
$cond{
    (1==2){return 1}
    (2==2){return 2}
    (3==2){return 3}
  }

export $cond
