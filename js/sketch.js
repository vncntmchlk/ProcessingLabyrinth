let hero;
var _up = false;
var _down = false;
var _right = false;
var _left = false;
var wallSize = 6;
let sample;

// function preload() {
//   sample = loadSound('../assets/schnarchen.mp3');
// }

function setup()
{
  createCanvas(1000, 760);
  background(250,250,250);
  hero = new Player(20, 600);
  //sample.loop();  
  //sample.amp(0);  
  //sample.pause();
}

function draw() {
  var posBall;
  background(250,250,250);
  hero.display();

  posBall = hero.getPos();
  soundCloud(posBall[0], posBall[1], 50, 50);

  drawMaze();
  
  if(_up)
  hero.moveUp();
  if(_down)
  hero.moveDown();
  if(_left)
  hero.moveLeft();
  if(_right)
  hero.moveRight();
}

function drawMaze(){
  fill(0);
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

function keyPressed()
{
  if (key == 'w')
  {
    _up = true;  
  }
  if (key == 's')
  {
    _down = true;

  }
  if (key == 'a')
  {
    _left = true;
  }
  if (key == 'd')
  {
    _right = true;
  }
}


function keyReleased()
{
  if (key == 'w')
  {
    _up = false;
    
  }
  if (key == 's')
  {
    _down = false;

  }
  if (key == 'a')
  {
    _left = false;
  }
  if (key == 'd')
  {
    _right = false;
  }
}


class Player {
  constructor(tempX, tempY) {
    this.xpos = tempX;
    this.ypos = tempY;
    this.ballSize = 10;
    this.ballW = 6; //(ballSize / 2) + 1;
    this.moveSpeed = 3;
  }
  
  moveLeft(){
    var leftColor = get((int(this.xpos) - this.ballW ), int(this.ypos)); 
    if(leftColor[0] != 0){
      this.xpos = this.xpos - this.moveSpeed;
    }
  }

  moveRight(){
    var rightColor = get((int(this.xpos) + this.ballW), int(this.ypos));  
    if(rightColor[0] != 0){
      this.xpos = this.xpos + this.moveSpeed;
    }
  }
  moveUp(){
    var upColor = get(int(this.xpos), (int(this.ypos)- this.ballW)); 
    //console.log(upColor);
    if(upColor[0] != 0){
      this.ypos = this.ypos - this.moveSpeed;
    }
  }
  moveDown(){
    var downColor = get(int(this.xpos), (int(this.ypos) + this.ballW)); 
    if(downColor[0] != 0){
      this.ypos = this.ypos + this.moveSpeed;
    }
  }
  
  display(){
    ellipse(this.xpos, this.ypos, this.ballSize, this.ballSize); 
  }

  getPos() {
    var results = [this.xpos, this.ypos];
    // results[0] = xpos;
    // results[1] = ypos;
    return results;
  }
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