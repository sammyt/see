describe("see", function(){
  describe('tokenize', function(){
    it('should tokenize simple tag', function(){
      var tokens = see._tokenize('div')
      tokens.should.eql([{tag:'div'}])
    })
    it('should tokenize nesting div>span', function(){
      var tokens = see._tokenize('div>span')
      tokens.should.eql(
        [ {tag:'div'}
        , '>'
        , {tag:'span'}
        ])
    })
    it('should tokenize siblings div+span', function(){
      var tokens = see._tokenize('div+span')
      tokens.should.eql(
        [ {tag:'div'}
        , '+'
        , {tag:'span'}
        ])
    })
    it('should tokenize siblings and nesting div+span>ul>li', function(){
      var tokens = see._tokenize('div+span>ul>li')
      tokens.should.eql(
        [ {tag:'div'}
        , '+'
        , {tag:'span'}
        , '>'
        , {tag:'ul'}
        , '>'
        , {tag:'li'}
        ])
    })
    it('should tokenize groupings div>(span>span)', function(){
      var tokens = see._tokenize('div>(span>span)')
      tokens.should.eql(
        [ {tag:'div'}
        , '>'
        , [ {tag:'span'}
          , '>'
          , {tag:'span'}
          ]
        ])
    })
    it('should tokenize groupings (span.bar>span)>div', function(){
      var tokens = see._tokenize('(span.bar>span)>div')
      tokens.should.eql(
        [ [ {tag:'span', classifiers:['bar']}
          , '>'
          , {tag:'span'}
          ]
        , '>'
        , {tag:'div'}
        ])
    })
    it('should tokenize groupings (div>(ul>li))+div', function(){
      var tokens = see._tokenize('(div>(ul>li))+div')
      tokens.should.eql(
        [ [ {tag:'div'}
          , '>'
          , [ {tag:'ul'}
            , '>'
            , {tag:'li'}
            ]
          ]
        , '+'
        , {tag:'div'}
        ])
    })
    it('should tokenize classes div.foo', function(){
      var tokens = see._tokenize('div.foo')
      tokens.should.eql(
        [ {tag:'div', classifiers : ['foo']}
        ])
    })
    it('should tokenize classes div.foo.bar.far.fee', function(){
      var tokens = see._tokenize('div.foo.bar.far.fee')
      tokens.should.eql(
        [ {tag:'div', classifiers : ['foo', 'bar', 'far', 'fee']}
        ])
    })
    it('should tokenize target identifier', function(){
      var tokens = see._tokenize('div>$span>a')
      tokens.should.eql(
        [ {tag:'div'}
        , '>'
        , '$'
        , {tag:'span'}
        , '>'
        , {tag:'a'}
        ])
    })
  })
  describe('see', function(){
    it('create nested tags', function(){ 
      var s = d3.select('body').append('div')
      s.call(see('div>span>a'))

      s.select('div').empty().should.be.false
      s.select('div').select('span').empty().should.be.false
      s.select('div').select('span').select('a').empty().should.be.false
    })
    it('create sibling tags', function(){ 
      var s = d3.select('body').append('div')
      s.call(see('div+span+a'))

      s.select('div').empty().should.be.false
      s.select('span').empty().should.be.false
      s.select('a').empty().should.be.false
      console.log(s.node())
    })
    it('create mixed tags', function(){ 
      var s = d3.select('body').append('div')
      s.call(see('div>span+a'))
      
      s.select('div').empty().should.be.false
      s.select('div').select('span').empty().should.be.false
      s.select('div').select('a').empty().should.be.false

      console.log(s.node())
    })
    it('create groupings', function(){ 
      var s = d3.select('body').append('div')
      s.call(see('(div>(span>a))+span'))

      s.select('div').empty().should.be.false
      s.select('div').select('span').empty().should.be.false
      s.select('div').select('a').empty().should.be.false
      s.select('span').empty().should.be.false

      console.log(s.node())
    })
    it('create groupings', function(){ 
      var s = d3.select('body').append('div')
      s.call(see('div+div>p>span+em'))

      console.log(s.node())
    })
  })
})




