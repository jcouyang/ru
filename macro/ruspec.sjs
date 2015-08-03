macro fact {
  rule {
    $name {$body...}
  } => {
    describe($name, function(){$body...});
  }
}

macro should {

  rule {
    $actual... => $expect:expr
  } => {
    it('',function(){expect($actual...).toBe($expect)});
  }
}

macro shouldnot {
    rule {
    $actual:expr => $expect:expr
  } => {
    it('',function(){expect($actual).not.toBe($expect)});
  }

  rule {
    $name:lit $actual:expr => $expect:expr
  } => {
    it($name,function(){expect($actual).not.toBe($expect)});
  }
}

export fact;
export should;
export shouldnot;
