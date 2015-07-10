var sweet = require('sweet.js')
module.exports = sweet.currentReadtable().extend({
  '#': function(ch, reader) {
    var hashtag = reader.readIdentifier();
    var pun = reader.readToken();
    switch(pun.value){
    case 'mori.hashMap':
      var delim  = reader.readToken();
        return [reader.makeIdentifier('mori.set')].concat(
          reader.makeDelimiter('()', reader.makeDelimiter('[]', delim.inner)))
    case '()':
      return [reader.makeIdentifier('$$')].concat(
        reader.makeDelimiter('()',pun.inner)
      )
    case '[]':
      return [reader.makeIdentifier('mori.vector')].concat(
        reader.makeDelimiter('()',pun.inner)
      );
    case '{}':
      return [reader.makeIdentifier('mori.hashMap')].concat(
        reader.makeDelimiter('()',pun.inner)
      );
      
    default: reader.throwSyntaxError('ru',
                                     'Expected delimiter after #: {}, [], (), #{}',
                                    hashtag);
    }
  }
})
