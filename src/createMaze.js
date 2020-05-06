/* code von https://github.com/CodingTrain/website/tree/master/CodingChallenges/CC_010_Maze_DFS/P5 wurde hier verarbeitet*/

function setupMaze () {
    cols = floor(width / widthOfWay);
    rows = floor((height - mazeOffset) / widthOfWay) ;
  
    for (let j = 0; j < rows; j++) {
      for (let i = 0; i < cols; i++) {
        var cell = new Cell(i, j);
        grid.push(cell);
      }
    }
    current = grid[0];
    return [cols, rows]
};

function drawMaze () {
    
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

        if (neighbors.length > 0) {
        let r = floor(random(0, neighbors.length));
        return neighbors[r];
        } else {
        return undefined;
        }
    };

    this.show = function() {
        let x = this.i * widthOfWay;
        let y = (this.j * widthOfWay) + mazeOffset;
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
    };
}