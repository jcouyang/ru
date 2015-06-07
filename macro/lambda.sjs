let fn = macro {
    case {$ctx
    ($body:expr)
    }=>{
        var args = #{$body}.reduce(function(all,s){
            return all.concat(s.token.inner
                        .filter(function(_){return _.token.value.match(/^\$\d?$/)}))
                        .sort(function(x,y){return (x.token.value.match(/^\$(\d?)$/).pop())-(y.token.value.match(/^\$(\d?)$/).pop())})
        },[])
        letstx $args = args
        return [
            makeKeyword('function', #{$ctx}),
      makeDelim('()', args, #{$body}),
      makeDelim('{}', #{return $body}, #{$ctx})
        ]
    }
}
export fn;
