let figur; 
let posFigur = [];
let clouds = [];
let wallSize = 15; // wenn die waende zu duenn sind kann man durchglitchen
let samplePath = [
  'src/sf/schnarchen.mp3',
  'src/sf/schluerfen.mp3'
];
let samples = [];
let counter = 0;

function preload() {
  samplePath.forEach(function(path) {
    samples.push(loadSound(path));
  });
}

function setup() {
  // soll auf langsamen Geraeten gleich laufen wie auf schnellen.
  // bei hoeherer Framerate kann es durch cpu belastung langsamer werden
  frameRate(16); 
  createCanvas(displayWidth, displayHeight); // noch je nach bildschirmgroesse anpassen
  noStroke();
  angleMode(DEGREES); // 
  figur = new Player(20, 20); // startposition angeben
  clouds.push(new SoundCloud(550, 350, 100, samples[0])); // position x y, size und sample
  clouds.push(new SoundCloud(250, 150, 100, samples[1]));
}

function draw() {
  
  background(250,250,250);
  drawMaze();
  figur.display();
  posFigur = figur.getPos();

  clouds.forEach(function(cloud) {
    cloud.display();
    cloud.onOffSound();
  });

  if(mouseIsPressed){
    figur.checkAngleAndMove();
  }

  counter += 10;

}

function drawMaze() {
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

class Player {
  constructor(tempX, tempY) {
    this.xpos = tempX;
    this.ypos = tempY;
    this.ballSize = 20;
    this.ballW = 12; //(ballSize / 2) + 1;
    this.moveSpeed = 8;
    this.color = color(204, 102, 0);
  }

  checkAngleAndMove(){
    let dx = mouseX - this.xpos;
    let dy = mouseY - this.ypos;
    let angle = atan2(dy, dx) + 180;  
    switch (true) {
        case (angle > 45 && angle < 135): //oben
            let upColor = get(int(this.xpos), (int(this.ypos)- this.ballW));
            if(upColor[0] != 0){ //kollision pruefen, nur bei weissen pixeln weiter bewegen
              this.ypos = this.ypos - this.moveSpeed;
            }
            break;
        case (angle > 135 && angle < 225): //rechts
            let rightColor = get((int(this.xpos) + this.ballW), int(this.ypos));  
            if(rightColor[0] != 0){
                this.xpos = this.xpos + this.moveSpeed;
            }
            break;
        case (angle > 225 && angle < 315): //unten
            let downColor = get(int(this.xpos), (int(this.ypos) + this.ballW)); 
            if(downColor[0] != 0){
                this.ypos = this.ypos + this.moveSpeed;
            }
            break;
        default: //links
            let leftColor = get((int(this.xpos) - this.ballW ), int(this.ypos)); 
            if(leftColor[0] != 0){
                this.xpos = this.xpos - this.moveSpeed;
            }
    }
  }
  
  display(){
    fill(this.color);
    ellipse(this.xpos, this.ypos, this.ballSize, this.ballSize); 
  }

  getPos() {
    let results = [this.xpos, this.ypos];
    return results;
  }
}

class SoundCloud {
  constructor(posX, posY, size, sample) {
    this.xpos = posX;
    this.ypos = posY;
    this.cloudSize = size;
    this.inside = 0; //ehemals amp
    this.distanceToFig = 0;
    this.sample = sample;
    this.cloudSeed = random();
    this.color = color(random() * 150, random() * 150, random() * 150, 150);
  }

  display (){
    //stroke(100, 100);
    fill(this.color);
    translate(this.xpos, this.ypos);
    let newSize = this.cloudSize / 4; // den teilwert kann man ermitteln indem man die ellipse dazu schaltet
    let angle = counter;
    beginShape();
    for (let a = 0; a < 360; a+=15) {
      let offset = sin(angle) * (2 + this.cloudSeed) + 60 * noise(a * (0.03  + this.cloudSeed));
      let x = (newSize + offset) * cos(a);
      let y = (newSize + offset) * sin(a);
      curveVertex(x, y);
      angle += 13;
    }
    endShape(CLOSE);
    translate(-this.xpos, -this.ypos);
    //ellipse(this.xpos, this.ypos, this.cloudSize, this.cloudSize); 
  }

  onOffSound (){
    this.distanceToFig = dist(this.xpos, this.ypos, posFigur[0], posFigur[1]); //posFigur ist global, da es nur eine gibt
    this.inside = map(this.distanceToFig, this.cloudSize * 0.5, 0, 0, 1);
    if (this.inside < 0) { 
      if (this.sample.isPlaying()) {
        this.sample.pause();
      }
    } else {
      if (this.sample.isPlaying() == false) {
        this.sample.loop();
      }
    }
  }
}




// let counter = 0;

// function setup() {
//   createCanvas(600, 400);
//   angleMode(DEGREES);
//   noStroke();
// }

// function draw() {
//   background(220);
//   translate(width / 2, height / 2);
//   fill(0);

//   let w = 50;
//   let h = 25;
//   let angle = counter;
//   beginShape();
//   for (let a = 0; a < 360; a+=1) {
//     let offset = sin(angle)*2 + 40*noise(a*0.03);
//     let x = (w+offset) * cos(a);
//     let y = (h+offset) * sin(a);
//     curveVertex(x,y);
//     angle += 10;
//   }
//   endShape(CLOSE);
  
//   counter+=3;

// }