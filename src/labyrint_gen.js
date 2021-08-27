let cols, rows;
let w = 50;
let grid = [];
let current;
let stack = [];
let finished = false;
let lastRound = false;
let lineData = [];

// beginShape(TRIANGLE_FAN);
// vertex(57.5, 50);
// vertex(57.5, 15);
// vertex(92, 50);
// vertex(57.5, 85);
// vertex(22, 50);
// vertex(57.5, 15);
// endShape();

function setup() {
  createCanvas(600, 600);
  
  cols = floor(width / w);
  rows = floor(height / w);

  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      var cell = new Cell(i, j);
      grid.push(cell);
    }
  }

  current = grid[0];
}

function draw () {
  // if (lastRound == false){
  //   drawMaze();
  // };
  // if (finished == true){
  //   lastRound = true; 
  // };
  fill(100);
  ellipse(50,50,20,20);
}

function drawMaze () {
  background(255);
  for (let i = 0; i < grid.length; i++) {
    grid[i].show();
  }

  current.visited = true;
  current.highlight();
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
    finished = true;
  }
  //console.log(finished);
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