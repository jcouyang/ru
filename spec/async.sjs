var mori = require('con.js')
fact 'core.async' {
  
  it('async put and get channel a and b', function(done) {
    var channel1 = mori.async.chan();
    var channel2 = mori.async.chan();
    var data2 = [1,2,3];
    go {
      var a <! channel1;
      var b <! channel2;
      expect(a).toBe("data1");
      expect(b).toEqual([1,2,3]);
      done();
    };
    go {data2 >! channel2};
    go {'data1' >! channel1};
  })

  it('alts channel a and b', function(done) {
    var channela = mori.async.chan();
    var channelb = mori.async.chan();
    var data2 = [1,2,3];
    
    go {
      var anywho <!alts [channela, channelb];
      // vector.a(0) is equals to nth(vector, 0)
      expect(anywho.a(0)).toEqual([1,2,3]);
      expect(anywho.a(1)).toBe(channelb);
      done();
    };
    go {data2 >! channelb};
    go {'data1' >! channela};
  })

  it('go-loop', function(done) {
    var channel = mori.async.chan();
    goLoop (count=0) {
      var val <! channel;
      expect(val).toBe('hehe'+count);
      if(count==2) done()
      recur(++count)
    };

    go{ 'hehe0' >! channel}
    go{ 'hehe1' >! channel}
    go{ 'hehe2' >! channel}
  })
}
