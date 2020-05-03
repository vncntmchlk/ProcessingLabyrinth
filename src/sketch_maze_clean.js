let figur; 
let posFigur = [];
let clouds = [];
let wallSize; // wenn die waende zu duenn sind kann man durchglitchen
let samplePath = [
  'src/gsg_soundfiles/gsg1.mp3',
  'src/gsg_soundfiles/gsg2.mp3',
  'src/gsg_soundfiles/gsg3.mp3',
  'src/gsg_soundfiles/gsg4.mp3',
  'src/gsg_soundfiles/gsg5.mp3',
  'src/gsg_soundfiles/gsg6.mp3',
  'src/gsg_soundfiles/gsg7.mp3',
  'src/gsg_soundfiles/gsg8.mp3'
  //'src/gsg_soundfiles/gsg9.mp3'
];
let searchSoundPath;
let searchSound;
let samples = [];
let counter = 0;
let button;
let buttonFound;
let soundPlayed = false;
let nowPlayingFile = undefined;
let foundText;
let loadLabText;
let lives = 1;

function preload() {
  searchSoundPath = random(samplePath);
  shuffle(samplePath);
  searchSound = loadSound(searchSoundPath);
  samplePath.forEach(function(path) {
    samples.push(loadSound(path));
  });
}

// to do random verlorene musik aussuchen und random die musik clouds verteilen
// button fuer gefunden

function setup() {
    let cloudSize;
    let useWidth;
    let useHeight;
    let canvas;
    let PlayerStartPos;
    let ballSize;
    let ballW;
    let ballSpeed;
    if (fixedSize) { // fuer groesse Displaysv
        useWidth = 800;
        useHeight = 800;
        widthOfWay = 70;
        cloudSize = 90;
        PlayerStartPos = 30;
        wallSize = 15;
        ballSize = 24;
        ballW = 14;
        ballSpeed = 10;
        // mazeOffset = 100;
    } else {
        useWidth = displayWidth;
        useHeight = displayHeight * (7/12);
        // mazeOffset = displayHeight * (1/4);
        widthOfWay = useWidth * 0.11;
        cloudSize = widthOfWay * 1.3;
        PlayerStartPos = 20;
        wallSize = 12;
        ballSize = 20;
        ballW = 12;
        ballSpeed = 9;
    };  

    let elt = document.getElementById('buttonPos');

    buttonFound = createButton('gefunden');
    buttonFound.mousePressed(checkFound);
    buttonFound.parent(elt);
    buttonFound.hide();
   
    button = createButton('verlorene Musik einmal hören');
    button.parent(elt); // use element from page
    button.mousePressed(playSearchSound);
    loadLabText = createP(' Labyrinth wird generiert ...');//.addClass('text').hide();
    loadLabText.parent(elt);
    loadLabText.style('color:red;');

    foundText = createP('Wird abgespielt ... ');
    foundText.parent(elt);
    foundText.style('color:white;');
    foundText.hide();

    canvas = createCanvas(useWidth, useHeight);
    canvas.parent('sketch-holder');

    let newDim = setupMaze();
    resizeCanvas(newDim[0] * widthOfWay, newDim[1] * widthOfWay); // die haesslichen weissen streifen entfernen

    noStroke();
    angleMode(DEGREES); // 
    figur = new Player(PlayerStartPos, PlayerStartPos + mazeOffset, ballSize, ballW, ballSpeed); // startposition angeben

    // anzahl der sf muss ganzzahlige root haben
    let gap = sqrt((useHeight * useWidth) / 8); // 3 * 3 feld
    let sampleCounter = 0;
   

    for (let y = 0; y < useHeight; y += gap) {
      for (let x = 0; x < useWidth; x += gap) {
        // clouds.push(new SoundCloud(x, y, cloudSize, samples[sampleCounter]));
        if(sampleCounter > 0){
          clouds.push(new SoundCloud(x + (gap * random() * 0.6), y + (gap * random() * 0.6), cloudSize, samples[sampleCounter]));
        };
        sampleCounter = (sampleCounter + 1) % 8
      }
    };

    // clouds.push(new SoundCloud((useWidth * 0.5) + (useWidth * 0.45 * random()), (useHeight * 0.45 * random()) + mazeOffset, cloudSize, samples[0])); 
    // clouds.push(new SoundCloud((useWidth * 0.45 * random()), (useHeight * 0.5) + (useHeight * 0.25 * random()) + mazeOffset, cloudSize, samples[1]));
}

function playSearchSound () {
  searchSound.play();
  foundText.show();
  setTimeout(startGame, searchSound.duration() * 1000);
  // startGame();
}

function startGame () {
  button.hide();
  buttonFound.show();
  soundPlayed = true;
  foundText.html(' Die Suche beginnt ...')
  setTimeout(weg, 3000);
}

function weg () {
  foundText.hide()
}

function checkFound () {
  foundText.show();
  if(searchSoundPath == nowPlayingFile){
    foundText.html('  gefunden!');
  } else {
    if(nowPlayingFile == undefined){
      foundText.html(' bewege dich zuerst über eine Klangwolke');
    } else {
      if(lives==1){
        foundText.html(' das wars noch nicht! 1 Versuch übrig');
      } else {
        foundText.html(' leider falsch! Spiel verloren');
        buttonFound.hide();
      }
      lives = 0;
    }
  }
  setTimeout(weg, 3000);
}

function draw() {  
  background(255);
  drawMaze();

// background(250,250,250);
  if (mazeFinished){    

    loadLabText.hide();
    if(soundPlayed){
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
  };

  }
}

class Player {
  constructor(tempX, tempY, ballSize, ballW, ballSpeed) {
    this.xpos = tempX;
    this.ypos = tempY;
    this.ballSize = ballSize; // 24
    this.ballW = ballW; //(ballSize / 2) + 1; 14
    this.moveSpeed = ballSpeed; //
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
    ellipse(this.xpos, this.ypos, this.cloudSize, this.cloudSize); 
  }

  onOffSound (){
    this.distanceToFig = dist(this.xpos, this.ypos, posFigur[0], posFigur[1]); //posFigur ist global, da es nur eine gibt
    this.inside = map(this.distanceToFig, this.cloudSize * 0.5, 0, 0, 1);
    //console.log(this.sample.file);
    if (this.inside < 0) { 
      if (this.sample.isPlaying()) {
        this.sample.pause();
        nowPlayingFile = undefined;
      }
    } else {
      if (this.sample.isPlaying() == false) {
        this.sample.loop();
        nowPlayingFile = this.sample.file;
      }
    }
  }
}