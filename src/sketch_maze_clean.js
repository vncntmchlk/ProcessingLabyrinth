let figur; 
let posFigur = [];
let clouds = [];
let wallSize; // wenn die waende zu duenn sind kann man durchglitchen
let samplePathAll = [
  "src/sf/sample_1.mp3",
  "src/sf/sample_2.mp3",
  "src/sf/sample_3.mp3",
  "src/sf/sample_4.mp3",
  "src/sf/sample_5.mp3",
  "src/sf/sample_6.mp3",
  "src/sf/sample_7.mp3",
  "src/sf/sample_8.mp3",
  "src/sf/sample_9.mp3",
  "src/sf/sample_10.mp3",
  "src/sf/sample_11.mp3",
  "src/sf/sample_12.mp3",
  "src/sf/sample_13.mp3",
  "src/sf/sample_14.mp3",
  "src/sf/sample_15.mp3",
  "src/sf/sample_16.mp3",
  "src/sf/sample_17.mp3",
  "src/sf/sample_18.mp3",
  "src/sf/sample_19.mp3",
  "src/sf/sample_20.mp3",
  "src/sf/sample_21.mp3"
];
let choosenSamples;
let choosenSearchSound;
let samplePath = [];
let searchSoundPath;
let searchSound;
let searchSoundDuration;
let lastSearchSound;
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
let onceRemoved;
let mazeSetupComplete = false;
let pg;
let rendered = false;
let newDim;
let oldGrid = [];

let cloudSize;
let useWidth;
let useHeight;
let canvas;
let PlayerStartPos;
let ballSize;
let ballW;
let ballSpeed;
let startBallSize;
let numOfClouds = 5;
let cloudPGs;

function preload() { // alle samples laden
  samplePathAll.forEach(function(sample) {
    samples.push(loadSound(sample));
  });
  chooseRandomSamples();
}

function chooseRandomSamples () {
  let i = 0;
  choosenSamples = [];
  chooseArr = Array.from({length: samplePathAll.length}, (v,i) => i);
  while (i < numOfClouds){
    choosenSamples.push(chooseArr.splice(random() * chooseArr.length, 1));
    i++
  };
  choosenSearchSound = random(choosenSamples);
  while(choosenSearchSound == lastSearchSound){
    choosenSearchSound = random(choosenSamples);
  };
}

function setup() {
    if (fixedSize) { // fuer groesse Displaysv
        useWidth = 800;
        useHeight = 800;
        startWidth = 100;//100;
        // startWidth = useWidth * 0.10;
        PlayerStartPos = 30;
        wallSize = 15;
        startBallSize = 24;
        ballSpeed = 10;
    } else {
        useWidth = displayWidth;
        useHeight = displayHeight * (7/12);
        startWidth = useWidth * 0.13;//* 0.11;
        PlayerStartPos = 20;
        wallSize = 12;
        startBallSize = 20;
        ballSpeed = 9;
    };  

    ballSize = startBallSize;
    ballW = int(ballSize / 2) + 2;

    widthOfWay = startWidth;
    cloudSize = widthOfWay * 0.95;

    let elt = document.getElementById('buttonPos');

    buttonFound = createButton('Gefunden');
    buttonFound.mousePressed(checkFound);
    buttonFound.parent(elt);
    buttonFound.hide();
   
    button = createButton('verlorene Musik einmal hören');
    button.parent(elt); // use element from page
    button.mousePressed(playSearchSound);
    searchSoundDuration = int(samples[choosenSearchSound].duration());
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

    setupMaze();
    resizeCanvas(newDim[0] * widthOfWay, newDim[1] * widthOfWay); // die haesslichen weissen streifen entfernen

    noStroke();
    angleMode(DEGREES); // 
    figur = new Player(PlayerStartPos, PlayerStartPos, ballSize, ballW, ballSpeed); // startposition angeben
    setupClouds(newDim);
}

function setupClouds (newDim) {
  let numOfCells = newDim[0] * newDim[1];
  let fillArr = Array.from({length: (numOfCells - 2)}, (v,i) => i + 2); // die ersten beiden zellen auslassen
  cloudPGs = [];
  for(i = 0; i < numOfClouds; i++){
    cloudPGs.push(createGraphics(widthOfWay, widthOfWay))
  };
  for(let i = 0; i < numOfClouds; i++){
    let indx = floor(fillArr.length * random());
    let removedItem = fillArr.splice(indx,1);
    let cellNum = removedItem[0];
    let cellMod = cellNum % newDim[1];
    let x = (((cellNum - cellMod) / newDim[1]));
    let y = cellMod ;
    clouds.push(new SoundCloud(x * widthOfWay, y * widthOfWay, cloudSize, choosenSamples[i], i, [x, y])); // 0.2
  };
}

function playSearchSound () {
  samples[choosenSearchSound].play();
  searchSoundDuration = int(samples[choosenSearchSound].duration());
  foundText.html(`Wird abgespielt ... (${searchSoundDuration} Sekunden) `);
  foundText.show();
  button.hide();
  setTimeout(startGame, searchSoundDuration * 1000);
}

function startGame () {
  buttonFound.show();
  soundPlayed = true;
  mazeFreeze = false;
  nowPlayingFile = undefined;
  foundText.html(' Die Suche beginnt ...');
  foundText.show();
  setTimeout(weg, 3000);
}

function weg () {
  foundText.hide()
}

function checkFound () {
  foundText.show();
  if(choosenSearchSound == nowPlayingFile){
    if (levelCounter == 5){
      foundText.html('Gratuliere! Du hast alle Level bewältigt!');
      levelCounter = 1; // zurueck zu level 1
      numOfClouds = 4;
      buttonReset.show();
    } else {
      foundText.html(`  Gefunden! Level ${levelCounter} geschafft!`);
      numOfClouds = 4 + (levelCounter * 2);
      levelCounter ++;
      buttonNext.show();
    };
    mazeFreeze = true;
    buttonFound.hide();
    samples.forEach(function(sample) {
      if (sample.isPlaying()) {
        sample.stop(); //pause
      }
    });
    lastSearchSound = choosenSearchSound;
  } else {
    if(nowPlayingFile == undefined){
      foundText.html(' Bewege dich zuerst über eine Klangwolke');
      setTimeout(weg, 3000);
    } else {
      if(lives==1){
        foundText.html(' Das wars noch nicht! 1 Versuch übrig');
        setTimeout(weg, 3000);
        lives = 0;
      } else {
        foundText.html(' Leider falsch! Neue Runde?');
        levelCounter = 1; // zurueck zu level 1
        numOfClouds = 4;
        mazeFreeze = true;
        buttonFound.hide();
        buttonReset.show();
        samples.forEach(function(sample) {
          if (sample.isPlaying()) {
            sample.stop(); //pause
          }
        });
        lastSearchSound = choosenSearchSound;
      }
    }
  }
}

function resetMaze () {
  mazeSetupComplete = false;
  frameRate(60); // fuer labyrinth generierung hochsetzen
  chooseRandomSamples();
  buttonFound.hide();
  buttonReset.hide();
  buttonNext.hide();
  grid = [];
  stack = [];
  mazeFinished = false;
  widthOfWay = int(startWidth - (startWidth * ((levelCounter - 1) / 9)));
  cloudSize = widthOfWay * 0.95;
  resizeCanvas(useWidth, useHeight); // damit es nicht immer kleiner wird
  setupMaze();
  resizeCanvas(newDim[0] * widthOfWay, newDim[1] * widthOfWay); // die haesslichen weissen streifen entfernen
  clouds = [];
  lives = 1;
  setupClouds(newDim);
  ballSize = int(startBallSize - (startBallSize * ((levelCounter - 1) / 9)));;
  ballW = int(ballSize / 2) + 2;
  figur.resetPos(PlayerStartPos, PlayerStartPos);
  button.show();
  loadLabText.html(` Labyrinth Level ${levelCounter} wird generiert ... `);
  loadLabText.show();
  foundText.hide();
  soundPlayed = false;
  if (samples[choosenSearchSound].isPlaying()) {
    samples[choosenSearchSound].stop();
  };
}

function draw() {  
  background(255);
  if(mazeSetupComplete){
    drawMaze();
    if (mazeFinished){    
      if(soundPlayed && !mazeFreeze){
        figur.display();
        let newGrid = figur.getGrid();
  
        if(newGrid[0] != oldGrid[0] || newGrid[1] != oldGrid[1]){
          clouds.forEach(function(cloud) {
            cloud.onOffSound(newGrid);
          });
        }
        oldGrid = newGrid;  
        clouds.forEach(function(cloud) {
          cloud.display();
        });  
        if(mouseIsPressed){
          figur.checkAngleAndMove();
        };
        counter += 10;
      };
    }
  };

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
    let angle = Math.atan2(dy, dx) + PI;  
    switch (true) {
        case (angle > 0.78 && angle < 2.35): //oben
            let upColor = get(int(this.xpos), (int(this.ypos)- this.ballW));
            if(upColor[0] != 0){ //kollision pruefen, nur bei weissen pixeln weiter bewegen
              this.ypos = this.ypos - this.moveSpeed;
            }
            break;
        case (angle > 2.35 && angle < 3.92): //rechts
            let rightColor = get((int(this.xpos) + this.ballW), int(this.ypos));  
            if(rightColor[0] != 0){
                this.xpos = this.xpos + this.moveSpeed;
            }
            break;
        case (angle > 3.92 && angle < 5.5): //unten
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
    strokeWeight(0);
    ellipse(this.xpos, this.ypos, this.ballSize, this.ballSize); 
  }

  getPos() {
    let results = [this.xpos, this.ypos];
    return results;
  }

  getGrid() {
    let results = [floor(this.xpos / widthOfWay), floor(this.ypos / widthOfWay)];
    return results;
  }
}



class SoundCloud {
  constructor(posX, posY, size, sample, cindex, myGrid) {
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
    this.cindex = cindex;
    this.rendered = false;
    this.grid = myGrid;
  }

  render (){
    let cl = cloudPGs[this.cindex];
    cl.noStroke();
    cl.fill(this.color);
    let newSize = this.cloudSize / 8; // den teilwert kann man ermitteln indem man die ellipse dazu schaltet
    let angle = counter;
    cl.beginShape();
    for (let a = 0; a < 360; a+=15) {
      let offset = sin(30) * (2 + this.cloudSeed) + this.shapeRand1 * noise(a * (0.03  + this.cloudSeed));
      let x = (newSize + offset) * cos(a);
      let y = (newSize + offset) * sin(a);
      curveVertex(x + (cl.width / 2), y + (cl.height / 2));
      angle += this.shapeMove;
    }
    cl.endShape(CLOSE);
  }

  display () {
    if(!this.rendered){
      this.render();
      this.rendered = true;
    }
    image(cloudPGs[this.cindex], this.xpos, this.ypos)
  }

  onOffSound (newGrid){
    // console.log(newGrid, this.grid);
    if ((newGrid[0] != this.grid[0]) || (newGrid[1] != this.grid[1])) { 
      if (samples[this.sample].isPlaying()) {
        samples[this.sample].stop(); //pause
        if(nowPlayingFile == choosenSearchSound){
          nowPlayingFile = undefined; // die clouds sollen nur ihr eigenes ding zuruecksetzen
        }
      }
    } else {
      if (samples[this.sample].isPlaying() == false) {
        samples[this.sample].play(); // loop
      }
      nowPlayingFile = this.sample;
    }
  }
}