macro m {
    case { _ $x } => {
        console.log(#{$x})
        debugger;
        return #{42}
    }
}
