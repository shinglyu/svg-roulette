var paper;
var arcs = []
var texts= []
var colorArr = ["#468966","#FFF0A5","#FFB03B","#B64926","#8E2800"];
var pieData = [120,120,120];
var pieText= ["hello world","super cool","rotate! rotate!"];
var sectorAngleArr = [];
var total = 0;
var startAngle = 0;
var endAngle = 0;
var x1,x2,y1,y2 = 0;
var center = {'x':200, 'y':200}
var diameter = 180;

function init(){
  paper = Raphael("holder");
  //CALCULATE THE TOTAL
  for(var k=0; k < pieData.length; k++){
    total += pieData[k];

  }
  //CALCULATE THE ANGLES THAT EACH SECTOR SWIPES AND STORE IN AN ARRAY
  for(var i=0; i < pieData.length; i++){
    var angle = Math.ceil(360 * pieData[i]/total);
    sectorAngleArr.push(angle);

  }
  drawArcs();

  spin();
}               

function spin(){
  var time = 3000; //ms
  var easing = '>'
  var rotateAngle = 90 * 10;
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
    arc.attr("fill",colorArr[i]);
    // create text
    var text = paper.text(center.x + diameter/2, center.y, pieText[i]);
    text.attr({"font-size": "20px"});
    text.transform('r'+(startAngle+endAngle)/2 + ' ' + center.x + ' ' + center.y)
    //alert(d);
    arcs.push(arc);
    texts.push(text);
  }
}
