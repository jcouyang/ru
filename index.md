---
layout: default
---

# What is 入

入 is a bunch of macro and datastructure ported from clojure to javascript

入 is based on 森(mori) + sweet.js macros

入 is begin something

入 is become something

入 is a chinese charactor trying his best pretending to be a λ

> May the 入 be with You!

# Why 入

## arity

```javascript
  fact 'defn arity func' {
    defn f {
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
    should [1,2,3,4].reduce(fn($+$2),0) => 10
  }
```

## let

```js
  fact 'init variables and return expr' {
    should let(a=1,b=2){a+b} => 3;
  }
```

### destructure let
```js
  fact 'destructure nested array' {
    should let([x,[y]]=[1,[2,4],3], [z] = [4,5,6]){
      x+y+z
    } => 7
  }
```

## looprecur
```javascript
  fact 'recur function' {
    defn f{(a,b){
      if(a>b) return a;
      recur(a++,b--)
    }}
    should f(1,36) => 19
  }
```

```javascript
  fact 'looprecur' {
    loop(a=1,b=36){
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

## 入 mori datastructure
```js
ru(map(inc, [0,1,2,3,4]))
// => mori.map(mori.inc, [0,1,2,3,4])

into([1],[3,4,5,6])
// => mori.into(mori.vector(1),[3,4,5,6])
```