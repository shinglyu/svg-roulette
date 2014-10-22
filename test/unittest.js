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
    });
  });

  describe('Arbitrary number of arcs', function(){
    it('generate arc deg array', function(){
      var degList = getPieData(1);
      expect(degList).to.have.length(1)
      expect(degList[0]).to.be.equal(360)
      var degList = getPieData(2);
      expect(degList).to.have.length(2)
      expect(degList[0]).to.be.equal(180)
      var degList = getPieData(7);
      expect(degList).to.have.length(7)
      expect(degList[0]).to.be.equal(51.42857142857143)
    })
  })
})

