new p5(function (p) {
 
    "use strict";
    // declare here any variables that should be global to your sketch
    // JS has function level scope so you don't have
    // to worry about this polluting the other sketches
    // DO NOT attach variables/methods to p!!!
    let button;
   
    p.setup = function () {
      p.createCanvas(200, 200);
      button = p.createButton('play file');
      button.position(0,0, 65);
    };
   
    // p.draw = function () {
    //   p.background(colour);
    // };
   
    // p.mousePressed = function () {
    //   console.info("sketch01");
    //   colour = (colour + 16) % 256;
    // };
  },
  // This second parameter targets a DOM 'node' - i.e.
  // an element in your hard-coded HTML or otherwise added via a script.
  // You can pass a direct reference to a DOM node or the element's 
  // id (simplest to manually set this in the HTML) can be used, as here:
"sketch01");

new p5(function (p) {
    "use strict";

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

function p.preload() {
  samplePath.forEach(function(path) {
    samples.push(loadSound(path));
  });
}

function p.setup() {
    let cloudSize;
    let useWidth;
    let useHeight;
    if (fixedSize) { // fuer groesse Displaysv
        useWidth = 800;
        useHeight = 800;
        widthOfWay = 70;
        cloudSize = 90;
    } else {
        useWidth = displayWidth;
        useHeight = displayHeight * (2/3);
        widthOfWay = 50;
        cloudSize = 30;
    };  
    p.createCanvas(useWidth, useHeight);

    // translate(0, -useHeight * 1/3);

    setupMaze();
    p.noStroke();
    p.angleMode(DEGREES); // 
    figur = new Player(20, 20); // startposition angeben
    clouds.push(new SoundCloud((useWidth * 0.5) + (useWidth * 0.45 * random()), (useHeight * 0.45 * random()), cloudSize, samples[0])); // position x y, size und sample
    clouds.push(new SoundCloud((useWidth * 0.45 * random()), (useHeight * 0.5) + (useHeight * 0.45 * random()), cloudSize, samples[1]));
}

function draw() {  
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
  };
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

let cols, rows;
let widthOfWay; // wie breit der Weg ist  
let grid = [];
let current;
let stack = [];
let mazeFinished = false;

function setupMaze () {
    cols = floor(width / widthOfWay);
    rows = floor(height / widthOfWay);
  
    for (let j = 0; j < rows; j++) {
      for (let i = 0; i < cols; i++) {
        var cell = new Cell(i, j);
        grid.push(cell);
      }
    }
    current = grid[0];
};

function drawMaze () {
    background(255);
    for (let i = 0; i < grid.length; i++) {
        grid[i].show();
    }

    current.visited = true;
    // STEP 1
    let next = current.checkNeighbors();
    if (next) {
        next.visited = true;

        // STEP 2
        stack.push(current);

        // STEP 3
        removeWalls(current, next);

        // STEP 4
        current = next;
    } else if (stack.length > 0) {
        current = stack.pop();
    } else {
        mazeFinished = true;

  // soll auf langsamen Geraeten gleich laufen wie auf schnellen.
  // bei hoeherer Framerate kann es durch cpu belastung langsamer werden
        frameRate(16);
    }
}
  
function index(i, j) {
if (i < 0 || j < 0 || i > cols - 1 || j > rows - 1) {
    return -1;
}
return i + j * cols;
}

function removeWalls(a, b) {
let x = a.i - b.i;
if (x === 1) {
    a.walls[3] = false;
    b.walls[1] = false;
} else if (x === -1) {
    a.walls[1] = false;
    b.walls[3] = false;
}
let y = a.j - b.j;
if (y === 1) {
    a.walls[0] = false;
    b.walls[2] = false;
} else if (y === -1) {
    a.walls[2] = false;
    b.walls[0] = false;
}
}

function Cell(i, j) {
    this.i = i;
    this.j = j;
    this.walls = [true, true, true, true];
    this.visited = false;
    this.sackGasse = false;

    this.checkNeighbors = function() {
        let neighbors = [];

        let top = grid[index(i, j - 1)];
        let right = grid[index(i + 1, j)];
        let bottom = grid[index(i, j + 1)];
        let left = grid[index(i - 1, j)];

        if (top && !top.visited) {
        neighbors.push(top);
        }
        if (right && !right.visited) {
        neighbors.push(right);
        }
        if (bottom && !bottom.visited) {
        neighbors.push(bottom);
        }
        if (left && !left.visited) {
        neighbors.push(left);
        }

        //console.log(neighbors.length);
        
        if (neighbors.length > 0) {
        let r = floor(random(0, neighbors.length));
        if(neighbors.length == 3){
            this.sackGasse = true;
        } else {
            this.sackGasse = false;
        }
        return neighbors[r];
        } else {
        return undefined;
        }
    };

    this.show = function() {
        let x = this.i * widthOfWay;
        let y = this.j * widthOfWay;
        stroke(0);
        strokeWeight(wallSize);
        if (this.walls[0]) {
        line(x, y, x + widthOfWay, y);
        }
        if (this.walls[1]) {
        line(x + widthOfWay, y, x + widthOfWay, y + widthOfWay);
        }
        if (this.walls[2]) {
        line(x + widthOfWay, y + widthOfWay, x, y + widthOfWay);
        }
        if (this.walls[3]) {
        line(x, y + widthOfWay, x, y);
        };
    //   if(this.sackGasse){
    //     ellipse(x,y,50,50);
    //   }
    };
}


},
// here I'm targeting a different container
"sketch02");