---
layout: default
---

# What is 入

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

## let

```js
  fact 'init variables and return expr' {
    should $let(a=1,b=2){a+b} => 3;
  }
```

### destructure let
```js
  fact 'destructure nested array' {
    should $let([x,[y]]=[1,[2,4],3], [z] = [4,5,6]){
      x+y+z
    } => 7
  }
```

## looprecur
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

## Existential
```js
  fact '?()' {
    fact 'nil'{
      var a = {b:null};
      should a.b?() => undefined  
    }
    fact 'not nil' {
      var a = {b:null};
      a.b =fn(5);
      should a.b?() => 5
    }
  }
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

## Readtable
### mori datastructure literals

```js
#[bar, he] // => mori.vector(bar,he)
#{a: 1, b: 2} //=> mori.hashMap(:a, 1, :b, 2)
##{1, 2, 3} //=> mori.set([1,2,3])
```
[Checkout all **Readable** Specs for detail...](https://github.com/jcouyang/ru/tree/master/spec)
