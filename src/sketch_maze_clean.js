let figur; 
let posFigur = [];
let clouds = [];
let wallSize = 15; // wenn die waende zu duenn sind kann man durchglitchen
let samplePath = [
  'src/sf/schnarchen.mp3',
  'src/sf/schluerfen.mp3'
];
let searchSoundPath = 'src/sf/schnarchen.mp3';
let searchSound;
let samples = [];
let counter = 0;
let loadText;

function preload() {
  samplePath.forEach(function(path) {
    samples.push(loadSound(path));
  });
  searchSound = loadSound(searchSoundPath);
}

function setup() {
    let cloudSize;
    let useWidth;
    let useHeight;
    if (fixedSize) { // fuer groesse Displaysv
        useWidth = 800;
        useHeight = 800;
        widthOfWay = 70;
        cloudSize = 90;
        // mazeOffset = 100;
    } else {
        useWidth = displayWidth;
        useHeight = displayHeight * (3/4);
        // mazeOffset = displayHeight * (1/4);
        widthOfWay = 50;
        cloudSize = 30;
    };  
    createCanvas(useWidth, useHeight);

    button = createButton('sound abspielen');
    button.position(0,50, 65);

  button.mousePressed(playSearchSound);

    // translate(0, -useHeight * 1/3);
    textSize(16);
    textFont('Georgia');  

    setupMaze();
    noStroke();
    angleMode(DEGREES); // 
    figur = new Player(20, 20 + mazeOffset); // startposition angeben
    clouds.push(new SoundCloud((useWidth * 0.5) + (useWidth * 0.45 * random()), (useHeight * 0.45 * random()) + mazeOffset, cloudSize, samples[0])); // position x y, size und sample
    clouds.push(new SoundCloud((useWidth * 0.45 * random()), (useHeight * 0.5) + (useHeight * 0.25 * random()) + mazeOffset, cloudSize, samples[1]));
}

function playSearchSound () {
  searchSound.play();
}

function showText(inText) {
  fill(0);
  strokeWeight(0);
  loadText = text(inText, 0, 16);
}

function draw() {  
  background(255);
  drawMaze();

// background(250,250,250);
  if (mazeFinished){    
    strokeWeight(0);
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
    showText('finished \n Suchen Sie im Labyrinth den folgenden Sound:');
  } else {
    showText("loading maze... \n Suchen Sie im Labyrinth den folgenden Sound:");
  }
}

class Player {
  constructor(tempX, tempY) {
    this.xpos = tempX;
    this.ypos = tempY;
    this.ballSize = 24; /// 20
    this.ballW = 14; //(ballSize / 2) + 1; 12
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
    this.color = color(0, random() * 80, random() * 80, 150); // der erste wert muss 0 bleiben, damit kein glitch durch die wand passiert
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