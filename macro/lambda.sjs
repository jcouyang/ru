macro # {
    case {$ctx
    ($body:expr)
    }=>{
        var args = #{$body}.reduce(function(all,s){
            return all.concat(s.token.inner
                        .filter(function(_){return _.token.value.match(/^\$\d?$/)}))
                        .sort(function(_){return _.token.value.match(/^\$(\d?)$/).pop()})
        },[])
        console.log(args)
        letstx $args = args
        return [
            makeKeyword('function', #{$ctx}),
      makeDelim('()', args, #{$body}),
      makeDelim('{}', #{$body}, #{$ctx})
        ]
    }
}
// map(#($+$2*$1))
export #;
