var sweet = require('sweet.js');
sweet.setReadtable('./src/readtable.js')
describe('readtable for mori datastructure', function() {

  it('should create vector via #[]',function() {
    var reads = sweet.compile('#[ bar, he]')
    expect(reads.code).toBe('mori.vector(bar, he);')
  })

  it('should be error when #',function() {
    expect(function() {
      sweet.compile('#asdf')
    }).toThrowError(SyntaxError)
  })

  it('should create hashmap via #{}',function() {
    var reads = sweet.compile('#{bar, he}')
    expect(reads.code).toBe('mori.hashMap(bar, he);')
  })

  it('should create set via ##{}',function() {
    var reads = sweet.expand('##{a,b}')
    expect(reads[0].token.value).toEqual('mori.set')
  })
  
  it('should create rambda via #()',function() {
    var reads = sweet.compile('#($ + $1)')
    expect(reads.code).toBe('$$($ + $1);')
  })
})
