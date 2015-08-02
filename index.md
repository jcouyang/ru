---
layout: default
---

# What is 入
<a href="https://news.ycombinator.com/submit" class="hn-button" data-url="http://ru-lang.org/" data-count="horizontal">Vote on Hacker News</a>
<a aria-label="Star jcouyang/ru on GitHub" data-count-aria-label="# stargazers on GitHub" data-count-api="/repos/jcouyang/ru#stargazers_count" data-count-href="/jcouyang/ru/stargazers" data-icon="octicon-star" href="https://github.com/jcouyang/ru" class="github-button">Star</a>

入 is a bunch of macros and datastructures ported from clojure to javascript

入 is based on 森(mori) + sweet.js macros

入 is begin something

入 is become something

入 is a chinese character trying his best pretending to be a λ

> May the 入 be with You!

# Why 入

- JavaScript is a flexible, but incomplete language
- CoffeeScript's indention is annoying, it's like a weirdo kid of ruby and python.
- ClojureScript is awesome but completely annother language, inconvenient for JavaScript interop.

so 入 here to to rip all good parts of clojure into native macros of JavaScript

> the following spec is written with macros [ruspec](https://github.com/jcouyang/ru/blob/master/macro/ruspec.sjs) in Joy of Clojure style
![](https://camo.githubusercontent.com/74a363f77896ab6fc4dbd6ab258d31b15de57ed2/68747470733a2f2f7261772e6769746875622e636f6d2f6d617269636b2f6d69646a652d636c6f6a7572652d746573742d7475746f7269616c2f6d61737465722f696d616765732f6f746865722f7472757468792e6a7067)

## arity

```javascript
  fact 'defn arity func' {
    $defn f {
      (a){a}
      (a, b) {a+b}
    }
    should f(1) => 1;
    should f(2,3) => 5;
  }
```

## lambda

```js
 fact 'with place holder' {
    should [1,2,3,4].reduce(#($+$2),0) => 10
  }
```

### let
```js
  fact 'destructure nested array' {
    should $let([x,[y]]=[1,[2,4],3], [z] = [4,5,6]){
      x+y+z
    } => 7
  }
```

## recur
```javascript
  fact 'recur function' {
    $defn f{(a,b){
      if(a>b) return a;
      recur(a++,b--)
    }}
    should f(1,36) => 19
  }
```

```javascript
  fact 'looprecur' {
    $loop(a=1,b=36){
      if(a>b) return a;
      recur(a++,b--)
    } => 19
  }
```

## core.async
```js
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
}
```
## thread
```js
should ('foo' ->> [mori.conj(mori.vector('bar')),
                   mori.map(function(x){return x.toUpperCase()})])
  .toString() => '("BAR" "FOO")'
}
```

## Readtable
### mori datastructure literals

```js
#[bar, he] // => mori.vector(bar,he)
#{a: 1, b: 2} //=> mori.hashMap(:a, 1, :b, 2)
##{1, 2, 3} //=> mori.set([1,2,3])
```

## 入(rù) mori datastructure
```js
  fact 'js to mori datastructure' {
  should mori.equals(
    $ru(map(inc, [0,1,2,3,4])),
    mori.vector(1,2,3,4,5)) => true
  }
  fact 'array' {
    should mori.equals(into([0],[1,2,3,4]), mori.vector(0,1,2,3,4)) => true
  }
```

## 出(chū) mori datastructure
```js
  fact 'mori expression to js' {
    should $chu(map(inc, [0,1,2,3,4])).pop() => 5
  }
```


[Checkout all **Readable** Specs for detail...](https://github.com/jcouyang/ru/tree/master/spec)
