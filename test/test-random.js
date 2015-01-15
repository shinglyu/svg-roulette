var min = 0;
var max = 10;
var rounds = 10000;
var stats1 = {};
var stats1 = {};

function getRandom(randomGen, thix) {
  return Math.floor(randomGen.bind(thix)() * (max - min + 1)) + min;
}
for (var n = min; n <= max; n += 1) {
  stats1[n] = 0;
}

for (var i = 0; i < rounds; i += 1) {
  stats1[getRandom(Math.random, Math)] += 1;
}

console.log("Math.random()")
console.log(stats1)

//--------------------------------------------
var stats2 = {};
for (var n = min; n <= max; n += 1) {
  stats2[n] = 0;
}

var m = new MersenneTwister();
for (var i = 0; i < rounds; i += 1) {
  stats2[getRandom(m.random, m)] += 1;
}

console.log("Mersenne-twister")
console.log(stats2)

