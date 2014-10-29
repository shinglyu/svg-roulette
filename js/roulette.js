var paper;
var arcs = []
var texts= []
var colorArr = ["#468966","#FFF0A5","#FFB03B","#B64926","#8E2800"];
/*
var colorArr = [
  "#468966",
  "#FFB03B",
  //"#B64926",
  "#FFF0A5",
  "#8F8F8F",
  "#468966",
  "#FFF0A5",
  "#FFB03B",
  "#FFF0A5",
  "#FFB03B",
  "#8F8F8F",
];
*/
var pieData = [ ];
var pieText= [
  'Firefox',
  'Thunderbird',
  'Sea Monkey',
  'Persona',
  'Bugzilla',
];
var sectorAngleArr = []; //remove in the future
var startAngle = 0;
var endAngle = 0;
var x1,x2,y1,y2 = 0;
var center = {'x':200, 'y':200}
var diameter = 180;

function getColor(i, total){
  return colorArr[i % total % colorArr.length];
  //return colorArr[i];
}

function getPieData(arcsCount){
  var tmpPieData = []
  for (var i = 0; i < arcsCount; ++i){
    tmpPieData.push(360/arcsCount)
  }
  return tmpPieData
  
}

function getRandom(max){
  var min = 0;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomDriftDeg(arcAngle){
  return Math.floor(0.9* (Math.random() * arcAngle - arcAngle/2)) ;
  
}
function init(){
  paper = Raphael("holder");
  //CALCULATE THE TOTAL
  pieData = getPieData(pieText.length);
  //CALCULATE THE ANGLES THAT EACH SECTOR SWIPES AND STORE IN AN ARRAY
  sectorAngleArr = pieData;
  drawRouletteShadow();
  drawArcs();
  drawPointer();

  spin(getRandom(pieText.length)); 
}               

function spin(id){
  var time = 8000; //ms
  //var easing = '>'
  var easing = 'cubic-bezier(0,1,0.1,1)' ;
  var rotateAngle = 360 * 8; 
  rotateAngle += getAngleFromID(id, arcs.length);
  rotateAngle += getRandomDriftDeg(pieData[0]);
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
  var arcAngle = 360/arcsCount;
  return (360 + arcAngle * arcId - arcAngle/2);
}

function drawRouletteShadow(){
    var offset = 5
    var c = paper.circle(center.x, center.y, diameter);
    c.attr("fill", "black");
    c.glow({width:15, offsetx:2.5, offsety:2.5});
  
}

function drawArcs(){
  for(var i=0; i <sectorAngleArr.length; i++){
    startAngle = endAngle;
    endAngle = startAngle + sectorAngleArr[i];

    x1 = parseInt(center.x+ diameter*Math.cos(Math.PI*startAngle/180));
    y1 = parseInt(center.y+ diameter*Math.sin(Math.PI*startAngle/180));

    x2 = parseInt(center.x+ diameter*Math.cos(Math.PI*endAngle/180));
    y2 = parseInt(center.y+ diameter*Math.sin(Math.PI*endAngle/180));                

    var d = "M" + center.x + "," + center.y + "L" + x1 + "," + y1 + " A" + diameter + "," + diameter + " 0 0,1 " + x2 + "," + y2 + " z"; //1 means clockwise
    arc = paper.path(d);
    arc.attr("fill", getColor(i, pieText.length));
    // create text
    var text = paper.text(center.x + diameter/2, center.y, pieText[i]);
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

document.getElementById('genBtn').onclick = function(){
  pieText = document.getElementById('items').value.split("\n");
  reset();
  init();
}
//window.onkeydown = (function(evt){if (evt.keyCode === 32 || evt.keyCode === 13){ init();}});
document.getElementById('items').value = pieText.join('\n')

