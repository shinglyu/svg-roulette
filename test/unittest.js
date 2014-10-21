var expect = chai.expect;

describe('Roulette', function(){
  describe('Random number', function(){
    it('find middle of an arc', function(){
      var arcCount = 3
      var deg = getAngleFromID(0, arcCount);
      expect(deg).to.be.equal(300)
      var deg = getAngleFromID(1, arcCount);
      expect(deg).to.be.equal(420)
      var deg = getAngleFromID(2, arcCount);
      expect(deg).to.be.equal(540)
    })
  })
})

