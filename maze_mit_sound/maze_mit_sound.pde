import processing.sound.*;
SoundFile file;

Player hero;
boolean _up, _down, _right, _left;
int wallSize = 6;

void setup()
{
  size(1000, 760);
  background(250, 250, 250);
  hero = new Player(20, 600);
  file = new SoundFile(this, "schnarchen.wav");
  file.amp(0);
  file.loop();
}

void draw()
{
  float[] posBall;
  background(250, 250, 250);
  hero.display();
  posBall = hero.getPos();
  soundCloud(posBall[0], posBall[1], 50, 50);
  drawMaze();

  if (_up)
    hero.moveUp();
  if (_down)
    hero.moveDown();
  if (_left)
    hero.moveLeft();
  if (_right)
    hero.moveRight();
}

void drawMaze() {
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

void keyPressed()
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


void keyReleased()
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

  float xpos;
  float ypos;
  int ballSize = 10;
  int ballW = (ballSize / 2) + 1;
  int moveSpeed = 3;

  Player(float tempX, float tempY) {
    xpos = tempX;
    ypos = tempY;
  }


  // bei den Bewegungen muss noch geclippt werden, damit man nicht aus dem feld laufen kann. oder eine mauer an allen aussenseiten
  void moveLeft() {
    color leftColor = get((int(xpos) - ballW ), int(ypos)); 
    if (leftColor != color(0, 0, 0)) {
      xpos = xpos - moveSpeed;
    }
  }
  void moveRight() {
    color rightColor = get((int(xpos) + ballW), int(ypos));  
    if (rightColor != color(0, 0, 0)) {
      xpos = xpos + moveSpeed;
    }
  }
  void moveUp() {
    color upColor = get(int(xpos), (int(ypos)- ballW)); 
    if (upColor != color(0, 0, 0)) {
      ypos = ypos - moveSpeed;
    }
  }
  void moveDown() {
    color downColor = get(int(xpos), (int(ypos) + ballW)); 
    if (downColor != color(0, 0, 0)) {
      ypos = ypos + moveSpeed;
    }
  }

  void display() {
    ellipse(xpos, ypos, ballSize, ballSize);
  }

  float[] getPos() {
    float[] results = new float[2];
    results[0] = xpos;
    results[1] = ypos;
    return results;
  }
}

void soundCloud(float xpos, float ypos, int cloudX, int cloudY) {
  float d; // Entfernung vom ball zum mittelpunkt
  float amp;
  int soundSize = 250;
  stroke(100, 100);
  fill(100, 100);
  ellipse( cloudX, cloudY, soundSize, soundSize); 
  d = dist( cloudX, cloudY, xpos, ypos);
  amp = map(d, soundSize * 0.5, 0, 0, 1);
  if (amp < 0) { 
    amp = 0;
  };
  file.amp(amp);
}
