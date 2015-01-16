var paper;
var arcs = []; //svg object
var texts= []; //svg object
var pieText= [
  'Firefox',
  'Thunderbird',
  'Sea Monkey',
  'Persona',
  'Bugzilla',
];
var center = {'x':200, 'y':200};
var diameter = 180;
var m = new MersenneTwister(); //move to global to fix the seed

//max not included, 0 to max-1
function getRandom(max){
  var min = 0;
  //return Math.floor(Math.random() * (max - min + 1)) + min;
  return Math.floor(m.random() * (max - min + 1)) + min;
}

function multiplyList(rawList){
  var list = rawList;
  // Strip empty entries
  while (list.indexOf("") > 0){
    list.splice(list.indexOf(""),1);
  }
  // Repeat items until it has more than 8 items
  while (list.length < 8){
    list = list.concat(list);
  }
  return list ;
}

function getAngleFromID(arcId, arcsCount){ // Do we need arcsCount?
  var arcAngle = 360/arcsCount;
  return (arcAngle * arcId + arcAngle/2);
}

function getRandomDriftDeg(multipliedItems){
  var arcAngle = 360/multipliedItems.length;
  return Math.floor(0.9* (Math.random() * arcAngle - arcAngle/2)) ;
}

function spinToId(id){
  //TODO: Move these config to the top
  var time = 8000; //ms
  //var easing = '>'
  var easing = 'cubic-bezier(0,1,0.1,1)' ;
  var rotateAngle = 360 * 4; 
  //var rotateAngle = 360 * 1; 
  rotateAngle -= getAngleFromID(id, multiplyList(pieText).length);
  rotateAngle += getRandomDriftDeg(multiplyList(pieText));
  // spinToId texts 
  texts.forEach(function(text){
    var fromAngle = parseInt(text.transform()[0][1]);
    var toAngle = fromAngle + rotateAngle;
    text.stop().animate({transform: "r" + toAngle + " " + center.x + " " + center.y}, time, easing); 
  });
  // spinToId arcs
  var roulette = paper.set(arcs);
  roulette.stop().animate({transform: "r" + rotateAngle + " " + center.x + " " + center.y}, time, easing); 
}


function getColor(i, total){
  var h = i/total;
  return "hsl(" + h + ", .7, 0.5)";
  //return colorArr[i % total % colorArr.length];
  //return colorArr[i];
}


function drawRouletteShadow(){
    var offset = 5;
    var c = paper.circle(center.x, center.y, diameter);
    c.attr("fill", "black");
    c.glow({width:15, offsetx:2.5, offsety:2.5});
  
}

function drawArcs(){
  //TODO: cleanup this two duplicated for
  var startAngle, endAngle = 0;
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
    arcs.push(arc);
  }
  //draw text on top of arcs
  for(var i=0; i <multiplyList(pieText).length; i++){
    startAngle = endAngle;
    endAngle = startAngle + 360/multiplyList(pieText).length;
    var text = paper.text(center.x + diameter/2, center.y, multiplyList(pieText)[i]);
    text.attr({"font-size": "20px"});
    text.transform('r'+(startAngle+endAngle)/2 + ' ' + center.x + ' ' + center.y);
    //alert(d);
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
  });
  texts = [];
  arcs = [];
}

function parseList(){
  var list = document.getElementById('items').value.split("\n");
  return list;
}


//url related
/*
//This will cause a refresh
function updateUrl(){
  var url = window.location.href;
  var baseUrl = url.split('?')[0];
  window.location.href = baseUrl + "?items=" + pieText.join(',');
}
*/

function getQueryStringByName(name){
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
  results = regex.exec(location.search);
  return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function init(){
  paper = Raphael("holder"); //Don't know why this have to be here
  // Order decides the z-index
  drawRouletteShadow();
  drawArcs();
  drawPointer();
}               

function randomSpin(){
  winnerId = getRandom(multiplyList(pieText).length - 1); //for 5 arcs, the id is 0 to 4
  spinToId(winnerId); 
}

function refreshUi(){
//Call this to reflect pieText change
  //pieText = parseList();
  document.getElementById('items').value = pieText.join("\n");
  document.getElementById('bookmarklink').href = "./roulette.html?items=" + pieText.join(',');

  if (typeof winnerId === "undefined") {
    document.getElementById('rmBtn').disabled = true;
  } else {
    document.getElementById('rmBtn').disabled = false;
  }
}

function removeWinner(){
  if (pieText.length <= 1) {return;}
  pieText.splice(winnerId % pieText.length, 1);
  document.getElementById('items').value = pieText.join("\n");
}

function readNewItemsFromTextarea() {
  pieText = document.getElementById('items').value.split("\n")
}

document.body.onload = function(){
  var query = getQueryStringByName('items');
  if (query !== ""){
    pieText = query.split(',');
  }
  //pieText = parseList();
  refreshUi();
  init();


  document.getElementById('genBtn').onclick = function(){
    //updateUrl();
    reset();
    readNewItemsFromTextarea();
    init();
    randomSpin();
    refreshUi();
  };

  document.getElementById('rmBtn').onclick = function(){
    //pieText = parseList();
    removeWinner();
    //readNewItemsFromTextarea();
    //updateUrl();
    reset();
    init();
    randomSpin();
    refreshUi();
  };

  document.getElementById('items').oninput= function(){
    document.getElementById('rmBtn').disabled = true;
  }

  //window.onkeydown = (function(evt){if (evt.keyCode === 32 || evt.keyCode === 13){ init();}});
  //
};
