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
    it('should tokenize attributes div[foo="bar"]', function(){
      var tokens = see._tokenize('div[foo="bar"]')
      tokens.should.eql(
        [ {tag:'div', attributes : {foo: "bar"}}
        ])
    })
    it('should tokenize attributes and classes div[foo="bar"].fooo.woo', function(){
      var tokens = see._tokenize('div[foo="bar"].fooo.woo')
      console.log(tokens)
      tokens.should.eql(
        [ {tag:'div'
          , attributes : {foo: "bar"}
          , classifiers : ['fooo', 'woo']
          }
        ])
    })
    it('should tokenize target identifier', function(){
      var tokens = see._tokenize('div>$span>a')
      tokens.should.eql(
        [ {tag:'div'}
        , '>'
        , {tag:'span', target:true}
        , '>'
        , {tag:'a'}
        ])
    })
  })

  var s
  beforeEach(function(){
    s = d3.select('body').append('div')
  })
  afterEach(function(){
    s.selectAll('*').remove()
  })

  describe('target nodes', function(){
    it('should return the outer node', function(){
      var node = see('span').apply(s.node())

      expect(node).to.be.ok
      node.tagName.should.equal('SPAN')
    })
    it('should return the outer node when many are created', function(){
      var node = see('section>div>p>span').apply(s.node())

      expect(node).to.be.ok
      node.tagName.should.equal('SECTION')
    })
    it('should return all nodes if siblings', function(){
      var nodes = see('section+div+p+span').apply(s.node())

      expect(nodes).to.have.length(4)
      nodes[0].tagName.should.equal('SECTION')
      nodes[1].tagName.should.equal('DIV')
      nodes[2].tagName.should.equal('P')
      nodes[3].tagName.should.equal('SPAN')
    })
    it('should return target node', function(){
      var node = see('$p+span').apply(s.node())
      node.tagName.should.equal('P')
    })
    it('should return nested target node', function(){
      var node = see('section>div>$strong>span').apply(s.node())
      node.tagName.should.equal('STRONG')
    })
    it('should return multiple target nodes', function(){
      var nodes = see('section>div>$strong+$strong>span').apply(s.node())
      nodes.should.have.length(2)
      nodes[0].tagName.should.equal('STRONG')
      nodes[1].tagName.should.equal('STRONG')
    })
    it('should return multiple target nodes with multiply', function(){
      var nodes = see('section>div>$strong*2>span').apply(s.node())
      nodes.should.have.length(2)
      nodes[0].tagName.should.equal('STRONG')
      nodes[1].tagName.should.equal('STRONG')
    })
  })
  describe('tag properties', function(){
    it('all classes to tag', function(){ 
      s.call(see('span.foo.bar'))
      s.select('span').classed('foo').should.be.true
      s.select('span').classed('bar').should.be.true
    })
    it('all classes to nested tags', function(){ 
      s.call(see('span.foo.bar>p.imp'))
      s.select('span').classed('foo').should.be.true
      s.select('span').classed('bar').should.be.true
      s.select('p').classed('imp').should.be.true
    })
  })
  describe('multiply', function(){
    it('should create multiple tags', function(){
      s.selectAll(see('p*10'))
      var kids = s.node().children

      kids.should.have.length(10)

      for (var i = kids.length - 1; i >= 0; i--) {
        kids[i].tagName.should.equal('P')
      }
    })
    it('should create multiple nested tags', function(){
      s.selectAll(see('nav>ul>li.small*5'))

      var kids = s.select('ul').node().children

      kids.should.have.length(5)
      for (var i = kids.length - 1; i >= 0; i--) {
        kids[i].tagName.should.equal('LI')
        kids[i].classList.contains('small').should.be.true
      }
    })
  })
  describe('end-to-end', function(){
    it('create nested tags', function(){ 
      s.call(see('div>span>a'))

      hasChild(s, 'div').should.be.true
      hasChild(s.select('div'), 'span').should.be.true
      hasChild(s.select('div').select('span'), 'a').should.be.true
    })
    it('create sibling tags', function(){ 
      s.call(see('div+span+a'))

      hasChild(s, 'div').should.be.true
      hasChild(s, 'span').should.be.true
      hasChild(s, 'a').should.be.true
    })
    it('create mixed tags', function(){ 
      s.call(see('div>span+a[href="/foo"]'))

      console.log(s.select('a').node())
      s.select('a').attr('href').should.equal('/foo')

      hasChild(s, 'div').should.be.true
      hasChild(s.select('div'), 'span').should.be.true 
      hasChild(s.select('div'), 'a').should.be.true

    })
    it('create groupings', function(){ 
      s.call(see('(div>(span>a))+span'))

      hasChild(s, 'div').should.be.true
      hasChild(s.select('div'), 'span').should.be.true
      hasChild(s.select('div').select('span'), 'a').should.be.true
      hasChild(s,'span').should.be.true
    })
    it('more work with siblings', function(){ 
      var node = s.node()

      s.call(see('div+div>p>span+em'))

      node.children.should.have.length(2)
      node.children[0].tagName.should.equal('DIV')
      node.children[1].tagName.should.equal('DIV')
      
      hasChild(d3.select(node.children[1]), 'p').should.be.true
      hasChild(d3.select(node.children[1].children[0]), 'span').should.be.true
    })
  })
})



function childrenOf(sel){
  return function(){ return sel.node().children }
}

function hasChild(sel, selector){
  return !sel.selectAll(childrenOf(sel)).filter(selector).empty()
}
