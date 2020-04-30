//stichwort collision detection. sieht kompliziert aus allerdings..
let bx;
let by;
let boxSize = 25;
let overBox = false;
let locked = false;
let xOffset = 0.0;
let yOffset = 0.0;

var wallSize = 6;
let sample;

// function preload() {
//   sample = loadSound('../assets/schnarchen.mp3');
// }

function setup()
{
  createCanvas(1000, 760);
  background(250,250,250);

  bx = width / 2.0;
  by = height / 2.0;
  //rectMode(RADIUS);
//   strokeWeight(2);
  //sample.loop();  
  //sample.amp(0);  
  //sample.pause();
}

function draw() {
  background(250,250,250);

  //soundCloud(posBall[0], posBall[1], 50, 50);

  if (
    mouseX > bx - boxSize &&
    mouseX < bx + boxSize &&
    mouseY > by - boxSize &&
    mouseY < by + boxSize
  ) {
    overBox = true;
    if (!locked) {
        stroke(150);
      fill(244, 122, 158);
    }
  } else {
    overBox = false;
  }

  // Draw the box
  stroke(150);
  fill(244, 122, 158);
  strokeWeight(2);
  rect(bx, by, boxSize, boxSize);

  drawMaze();
  
 
}

function drawMaze(){
  fill(0);
  stroke(0);
  strokeWeight(0);
  rect(-10, -10, 12, 780);
  rect(-10, -10, 1020, 12);
  rect(996, -10, 12, 1020);
  rect(0, 756, 1020, 12);
  rect(0, 700, 100, wallSize);
  rect(160, 700, 600, wallSize);
  rect(840, 700, 100, wallSize);
  rect(940, 504, wallSize, 200);
  rect(940, 504, 60, wallSize);
  rect(940, 0, wallSize, 840);
  rect(360, 50, wallSize, 890);
  rect(760, 624, wallSize, 80);
  rect(840, 510, wallSize, 190);
  rect(100, 514, wallSize, 190);
  rect(50, 864, wallSize, 240);
  rect(160, 650, wallSize, 50);
  rect(160, 646, 140, wallSize);
  rect(160, 600, wallSize, 50);
  rect(360, 646, 340, wallSize);
  rect(160, 595, 140, wallSize);
  rect(360, 596, wallSize, 50);
  rect(160, 864, wallSize, 80);
  rect(220, 864, wallSize, 80);
  rect(280, 864, wallSize, 80);
  rect(300, 544, wallSize, 55);
  rect(160, 540, 60, wallSize);
  rect(280, 540, 24, wallSize);
  rect(100, 860, 64, wallSize);
  rect(50, 224, wallSize, 185);
  rect(100, 54, wallSize, 805);
  rect(50, 220, 50, wallSize);
  rect(50, 0, wallSize, 165);
  rect(100, 50, 200, wallSize);
  rect(300, 110, wallSize, 300);
  rect(160, 110, wallSize, 290);
  rect(160, 800, 60, wallSize);
  rect(220, 800, wallSize, 64);
  rect(360, 50, 200, wallSize);
  rect(630, 50, 310, wallSize);
  rect(420, 220, wallSize, 374);
  rect(240, 110, wallSize, 240);
  rect(240, 350, 60, wallSize);
  rect(480, 160, wallSize, 840);
  rect(420, 100, wallSize, 60);
  rect(420, 160, 60, wallSize);
  rect(360, 594, 64, wallSize);
  rect(420, 100, 260, wallSize);
  rect(740, 100, 200, wallSize);
  rect(544, 160, 336, wallSize);
  rect(680, 100, wallSize, 60);
  rect(544, 840, 350, wallSize);
  rect(890, 840, wallSize, 200);
  rect(890, 504, 50, wallSize);
  rect(620, 510, 224, wallSize);
  rect(540, 840, wallSize, 160);
  rect(760, 570, wallSize, 100);
  rect(620, 570, 80, wallSize);
  rect(700, 570, wallSize, 80);
  rect(420, 380, 224, wallSize);
  rect(700, 300, wallSize, 140);
  rect(540, 320, 100, wallSize);
  rect(540, 220, wallSize, 100);
  rect(540, 220, 220, wallSize);
  rect(600, 270, 104, wallSize);
  rect(700, 270, wallSize, 100);
  rect(760, 220, wallSize, 164);
  rect(760, 380, 130, wallSize);
  rect(890, 380, wallSize, 60);
  rect(880, 160, wallSize, 60);
  rect(820, 160, wallSize, 160);
  rect(890, 280, wallSize, 120);
  rect(880, 220, 60, wallSize);
}


function mousePressed() {
    if (overBox) {
      locked = true;
      //fill(100, 0, 0);
    } else {
      locked = false;
    }
    xOffset = mouseX - bx;
    yOffset = mouseY - by;
  }
  
  function mouseDragged() {
    var pxColor;
    if (locked) {
        pxColor = get(mouseX, mouseY); 
        console.log(pxColor[0]);
       if (pxColor[0] < 240){
            bx = mouseX - xOffset;
            by = mouseY - yOffset;
        }
    }
  }
 
  function mouseReleased() {
    locked = false;
  }


function soundCloud(xpos, ypos, cloudX, cloudY) {
  var d; // Entfernung vom ball zum mittelpunkt
  var amp;
  var soundSize = 250;
  stroke(100, 100);
  fill(100, 100);
  ellipse( cloudX, cloudY, soundSize, soundSize); 
  d = dist( cloudX, cloudY, xpos, ypos);
  amp = map(d, soundSize * 0.5, 0, 0, 1);
  if (amp < 0) { 
    amp = 0;
  };
  //console.log(amp);
  //sample.amp(amp);
}