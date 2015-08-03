macro $dotimes {
  rule {
    ($n:expr) {$body...}
  } => {
      for(var i=0;i<$n;i++){
        $body...
      };
  }
}

export $dotimes;
