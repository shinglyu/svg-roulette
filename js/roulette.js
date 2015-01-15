var paper;
var arcs = []
var texts= []
var pieText= [
  'Firefox',
  'Thunderbird',
  'Sea Monkey',
  'Persona',
  'Bugzilla',
];
var center = {'x':200, 'y':200}
var diameter = 180;

function getColor(i, total){
  var h = i/total
  return "hsl(" + h + ", .7, 0.5)"
  //return colorArr[i % total % colorArr.length];
  //return colorArr[i];
}

//FIXME: Eliminate this
function getPieData(arcsCount){
  var tmpPieData = []
  for (var i = 0; i < arcsCount; ++i){
    tmpPieData.push(360/arcsCount)
  }
  return tmpPieData
  
}

function multiplyList(rawList){
  var list = rawList
  while (list.indexOf("") > 0){
    list.splice(list.indexOf(""),1)
  }
  while (list.length < 8){
    list = list.concat(list)
  }
  return list 
}

//max not included, 0 to max-1
function getRandom(max){
  var min = 0;
  var m = new MersenneTwister();
  //return Math.floor(Math.random() * (max - min + 1)) + min;
  return Math.floor(m.random() * (max - min + 1)) + min;
}

function getRandomDriftDeg(multipliedItems){
  var arcAngle = 360/multipliedItems.length
  return Math.floor(0.9* (Math.random() * arcAngle - arcAngle/2)) ;
}

function spin(id){
  //TODO: Move these config to the top
  var time = 8000; //ms
  //var easing = '>'
  var easing = 'cubic-bezier(0,1,0.1,1)' ;
  var rotateAngle = 360 * 9; 
  //var rotateAngle = 360 * 1; 
  rotateAngle -= getAngleFromID(id, arcs.length);
  rotateAngle += getRandomDriftDeg(multiplyList(pieText));
  // spin arcs
  var roulette = paper.set(arcs)
  roulette.stop().animate({transform: "r" + rotateAngle + " " + center.x + " " + center.y}, time, easing); 
  // spin texts 
  texts.forEach(function(text){
    var fromAngle = parseInt(text.transform()[0][1])
    var toAngle = fromAngle + rotateAngle
    text.stop().animate({transform: "r" + toAngle + " " + center.x + " " + center.y}, time, easing); 
  })
}

function getAngleFromID(arcId, arcsCount){
  if (arcId > arcsCount) {
    console.error("arcId overflow")
  }
  var arcAngle = 360/arcsCount;
  return (arcAngle * arcId + arcAngle/2);
}

function drawRouletteShadow(){
    var offset = 5
    var c = paper.circle(center.x, center.y, diameter);
    c.attr("fill", "black");
    c.glow({width:15, offsetx:2.5, offsety:2.5});
  
}

function drawArcs(){
  var startAngle, endAngle = 0
  var x1,x2,y1,y2 = 0;
  for(var i=0; i <multiplyList(pieText).length; i++){
    startAngle = endAngle;
    endAngle = startAngle + 360/multiplyList(pieText).length;

    x1 = parseInt(center.x+ diameter*Math.cos(Math.PI*startAngle/180));
    y1 = parseInt(center.y+ diameter*Math.sin(Math.PI*startAngle/180));

    x2 = parseInt(center.x+ diameter*Math.cos(Math.PI*endAngle/180));
    y2 = parseInt(center.y+ diameter*Math.sin(Math.PI*endAngle/180));                

    var d = "M" + center.x + "," + center.y + "L" + x1 + "," + y1 + " A" + diameter + "," + diameter + " 0 0,1 " + x2 + "," + y2 + " z"; //1 means clockwise
    arc = paper.path(d);
    arc.attr("fill", getColor(i, multiplyList(pieText).length));
    // create text
    var text = paper.text(center.x + diameter/2, center.y, multiplyList(pieText)[i]);
    text.attr({"font-size": "20px"});
    text.transform('r'+(startAngle+endAngle)/2 + ' ' + center.x + ' ' + center.y)
    //alert(d);
    arcs.push(arc);
    texts.push(text);
  }
}

function drawPointer(){
    var pcmd = "M" + center.x + "," + center.y + " m" + diameter + ",0" + " m-20,0 l35,-5 l0,10 z"; 
    var p = paper.path(pcmd); 
    p.attr("fill", "#F0F0F0");
    p.glow({width:5, offsetx:2.5, offsety:2.5});
}

function reset(){
  paper.remove();
  texts.forEach(function(text){
    text.remove();
  })
  texts = []
  arcs = []
}

function parseList(){
  var list = document.getElementById('items').value.split("\n");
  return list
}


//url related
function updateUrl(){
  var url = window.location.href;
  var baseUrl = url.split('?')[0]
  window.location.href = baseUrl + "?items=" + pieText.join(',')
}

function getQueryStringByName(name){
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
  results = regex.exec(location.search);
  return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function init(){
  paper = Raphael("holder");
  drawRouletteShadow();
  drawArcs();
  drawPointer();

  winnerId = getRandom(multiplyList(pieText).length - 1 ); //for 5 arcs, the id is 0 to 4
  spin(winnerId); 
}               

document.getElementById('genBtn').onclick = function(){
  pieText = parseList();
  updateUrl();
  reset();
  init();
}

document.getElementById('rmBtn').onclick = function(){
  //pieText = parseList();
  pieText.splice(winnerId % pieText.length, 1);
  updateUrl();
  //reset();
  //init();
}
//window.onkeydown = (function(evt){if (evt.keyCode === 32 || evt.keyCode === 13){ init();}});
document.getElementById('items').value = pieText.join('\n')

document.body.onload = function(){
  var query = getQueryStringByName('items')
  if (query != ""){
    pieText = query.split(',')
  }
  document.getElementById('items').value = pieText.join('\n')
  pieText = parseList()
  init()
}

