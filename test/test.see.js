describe("See", function(){
	describe("see()", function(){
    it("should return a function", function(){
      see.should.be.a('function')
    })
  })
  describe("see._parse", function(){
    it("should return an array with one part", function(){
      var parts = see._parse('div')
      parts.should.be.a('array')
      parts.should.have.length(1)
      parts.should.eql(['div'])
    })
    it("should find 3 parts for div>div", function(){
      var parts = see._parse('div>div')
      parts.should.eql(['div', '>', 'div'])
    })
  })
})




