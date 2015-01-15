var expect = chai.expect;

//mocha.setup({globals: ['N', 'M', "MATRIX_A", "UPPER_MASK", "LOWER_MASK", "mt", "mti"]}); 
//
describe('Roulette', function(){
  describe('Random number', function(){
    it('find middle of an arc', function(){
      var arcCount = 3;
      var deg = getAngleFromID(0, arcCount);
      expect(deg).to.be.equal(60);
      deg = getAngleFromID(1, arcCount);
      expect(deg).to.be.equal(180);
      deg = getAngleFromID(2, arcCount);
      expect(deg).to.be.equal(300);
    });
  });

  describe('Arbitrary number of arcs', function(){
    it('generate arc deg array', function(){
      var degList = getPieData(1);
      expect(degList).to.have.length(1);
      expect(degList[0]).to.be.equal(360);
      degList = getPieData(2);
      expect(degList).to.have.length(2);
      expect(degList[0]).to.be.equal(180);
      degList = getPieData(7);
      expect(degList).to.have.length(7);
      expect(degList[0]).to.be.equal(51.42857142857143);
    });
  });

  describe('Test get random number', function(){
    it('generate random number from 0 to 9', function(){
      var results = [];
      for (var i = 0; i < 1000; i += 1) {
        results.push(getRandom(9));
      }
      /*
      var bins = [0,0,0,0,0,0,0,0,0,0]
      for (var x of results) {
        bins[x] += 1;
      }
      console.log(bins)
      */
      for (var n = 0; n <= 9; n += 1) {
        expect(results.some(x => x == n)).to.be.ok;
      }
    });
    it('random number from 0 to 9 does not generate 10', function(){
      var results = [];
      for (var i = 0; i < 1000; i += 1) {
        results.push(getRandom(9));
      }
      var has10 = results.some(function(x){return x==10;});
      expect(has10).to.not.be.ok;
    });
    it('random number from 0 to 9 does generate 0', function(){
      var results = [];
      for (var i = 0; i < 1000; i += 1) {
        results.push(getRandom(9));
      }
      console.log(results.some(function(x){return x == 0}));
      expect(results.some(x => x==0)).to.be.ok;
    });
    it('random number from 0 to 9 does generate 9', function(){
      var results = []
      for (var i = 0; i < 1000; i += 1) {
        results.push(getRandom(9));
      }
      expect(results.some(function(x){return x==9})).to.be.ok;
    })
  })

  /*
  describe('Test get total rotate angle', function(){
    it('calculate total rotate angle with drift', function(){
      var items = ['1', '2', '3']

      var totalRotateAngle()
  });
  */

  describe('Test get drift', function(){
    it('calculate drift', function(){
      var items = ['1', '2', '3']

      var results = []
      for (var i = 0; i < 100; i += 1){
        results.push(getRandomDriftDeg(items));
      }

      var maxDeg = 360/items.length / 2 * 0.9 //90 percent of half the arc width 
      for (var result of results) {
        expect(result).to.be.at.least(-maxDeg)
        expect(result).to.be.at.most(maxDeg)
      }
      expect(results.some(d => d > 0)).to.be.ok;
      expect(results.some(d => d < 0)).to.be.ok;
      //expect(results.some(d => d == 0)).to.be.ok;
    })
  })
})

