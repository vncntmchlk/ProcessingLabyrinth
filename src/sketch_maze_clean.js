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
let searchSoundDuration;
let samples = [];
let counter = 0;
let button;
let buttonFound;
let soundPlayed = false;
let nowPlayingFile = undefined;
let foundText;
let loadLabText;
let lives = 1;
let levelCounter = 1;
let mazeFreeze = false;

let cols, rows;
let widthOfWay; // wie breit der Weg ist  
let grid = [];
let current;
let stack = [];
let mazeFinished = false;
let mazeOffset = 0;//130;
let startWidth; 

let cloudSize;
let useWidth;
let useHeight;
let canvas;
let PlayerStartPos;
let ballSize;
let ballW;
let ballSpeed;

// ToDo
// waere gut zu verhindern dass nicht zweimal der selbe sound gesucht werden muss!

function preload() {
  searchSoundPath = random(samplePath);
  // shuffle(samplePath);
  searchSound = loadSound(searchSoundPath);
  samplePath.forEach(function(path) {
    samples.push(loadSound(path));
  });
}

// to do random verlorene musik aussuchen und random die musik clouds verteilen
// button fuer gefunden

function setup() {
    if (fixedSize) { // fuer groesse Displaysv
        useWidth = 800;
        useHeight = 800;
        startWidth = 70;  
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
        startWidth = useWidth * 0.11;
        PlayerStartPos = 20;
        wallSize = 12;
        ballSize = 20;
        ballW = 12;
        ballSpeed = 9;
    };  

    widthOfWay = startWidth;
    cloudSize = widthOfWay * 0.95;

    let elt = document.getElementById('buttonPos');

    buttonFound = createButton('gefunden');
    buttonFound.mousePressed(checkFound);
    buttonFound.parent(elt);
    buttonFound.hide();
   
    button = createButton('verlorene Musik einmal hören');
    button.parent(elt); // use element from page
    button.mousePressed(playSearchSound);
    searchSoundDuration = searchSound.duration();
    loadLabText = createP(` Labyrinth Level ${levelCounter} wird generiert ... `);//.addClass('text').hide();
    loadLabText.parent(elt);
    loadLabText.style('color:red;');

    foundText = createP(`Wird abgespielt ... (${searchSoundDuration} Sekunden) `); //searchSound.duration()
    foundText.parent(elt);
    foundText.style('color:white;');
    foundText.hide();

    buttonReset = createButton('Neue Runde starten');
    buttonReset.parent(elt); // use element from page
    buttonReset.mousePressed(resetMaze);
    buttonReset.hide();

    buttonNext = createButton('Nächstes Level');
    buttonNext.parent(elt); // use element from page
    buttonNext.mousePressed(resetMaze);
    buttonNext.hide();

    canvas = createCanvas(useWidth, useHeight);
    canvas.parent('sketch-holder');

    let newDim = setupMaze();
    resizeCanvas(newDim[0] * widthOfWay, newDim[1] * widthOfWay); // die haesslichen weissen streifen entfernen

    noStroke();
    angleMode(DEGREES); // 
    figur = new Player(PlayerStartPos, PlayerStartPos, ballSize, ballW, ballSpeed); // startposition angeben
    setupClouds(newDim);
}

function setupClouds (newDim) {
  let numOfCells = newDim[0] * newDim[1];
  let fillArr = Array.from({length: (numOfCells - 0)}, (v,i) => i + 0); // die ersten beiden zellen auslassen
  for(let i = 0; i < 8; i++){
    let indx = floor(fillArr.length * random());
    let removedItem = fillArr.splice(indx,1);
    let cellNum = removedItem[0];
    let cellMod = cellNum % newDim[1];
    let x = (((cellNum - cellMod) / newDim[1])) * widthOfWay;
    let y = cellMod * widthOfWay;
    clouds.push(new SoundCloud(x + (widthOfWay * 0.5), y + (widthOfWay * 0.5), cloudSize * (1 + (0.2 * random())), samples[i])); // 0.2
  };
}

function playSearchSound () {
  searchSound.play();
  foundText.show();
  setTimeout(startGame, searchSoundDuration * 1000);
  startGame();
}

function startGame () {
  button.hide();
  buttonFound.show();
  soundPlayed = true;
  mazeFreeze = false;
  foundText.html(' Die Suche beginnt ...')
  setTimeout(weg, 3000);
}

function weg () {
  foundText.hide()
}

function checkFound () {
  foundText.show();
  if(searchSoundPath == nowPlayingFile){
    foundText.html(`  gefunden! Level ${levelCounter} geschafft!`);
    levelCounter ++;
    mazeFreeze = true;
    buttonFound.hide();
    buttonNext.show();
    samples.forEach(function(sample) {
      sample.stop();
    });
  } else {
    if(nowPlayingFile == undefined){
      foundText.html(' bewege dich zuerst über eine Klangwolke');
      setTimeout(weg, 3000);
    } else {
      if(lives==1){
        foundText.html(' das wars noch nicht! 1 Versuch übrig');
        setTimeout(weg, 3000);
      } else {
        foundText.html(' leider falsch! Neue Runde?');
        levelCounter = 1; // zurueck zu level 1
        mazeFreeze = true;
        buttonFound.hide();
        buttonReset.show();
        samples.forEach(function(sample) {
          sample.stop();
        });
      }
      lives = 0;
    }
  }
}

function resetMaze () {
  frameRate(60);
  searchSoundPath = random(samplePath);
  searchSound = loadSound(searchSoundPath);
  grid = [];
  stack = [];
  mazeFinished = false;
  widthOfWay = int(startWidth - (startWidth * ((levelCounter - 1) / 6)));
  cloudSize = widthOfWay * 0.95;
  let newDim = setupMaze();
  resizeCanvas(newDim[0] * widthOfWay, newDim[1] * widthOfWay); // die haesslichen weissen streifen entfernen
  clouds = [];
  lives = 1;
  setupClouds(newDim);
  figur.resetPos(PlayerStartPos, PlayerStartPos);
  button.show();
  loadLabText.html(` Labyrinth Level ${levelCounter} wird generiert ... `);
  loadLabText.show();
  buttonFound.hide();
  buttonReset.hide();
  foundText.hide();
  buttonNext.hide();
  soundPlayed = false;
  if (searchSound.isPlaying()) {
    searchSound.pause();
  };
  // setTimeout(weg, 3000);
}

function draw() {  
  background(255);
  drawMaze();

  if (mazeFinished){    
    loadLabText.hide();
    if(soundPlayed && !mazeFreeze){
      strokeWeight(0);
      figur.display();
      posFigur = figur.getPos();

      clouds.forEach(function(cloud) {
        cloud.display();
        cloud.onOffSound();
      });

      if(mouseIsPressed){
        figur.checkAngleAndMove();
      };
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

  resetPos(newX, newY){
    this.xpos = newX;
    this.ypos = newY;
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
    this.color = color(0, random() * 80, random() * 80, 200); // der erste wert muss 0 bleiben, damit kein glitch durch die wand passiert
    this.shapeRand1 = 30 + (10 * random());
    this.shapeMove = 5 + (15 * random());
  }

  display (){
    //stroke(100, 100);
    fill(this.color);
    translate(this.xpos, this.ypos);
    let newSize = this.cloudSize / 8; // den teilwert kann man ermitteln indem man die ellipse dazu schaltet
    let angle = counter;
    beginShape();
    for (let a = 0; a < 360; a+=15) {
      let offset = sin(angle) * (2 + this.cloudSeed) + this.shapeRand1 * noise(a * (0.03  + this.cloudSeed));
      let x = (newSize + offset) * cos(a);
      let y = (newSize + offset) * sin(a);
      curveVertex(x, y);
      angle += this.shapeMove;
    }
    endShape(CLOSE);
    translate(-this.xpos, -this.ypos);
    //ellipse(this.xpos, this.ypos, this.cloudSize, this.cloudSize); 
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