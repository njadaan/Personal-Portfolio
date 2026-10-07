let playerX = 100;
let playerY = 320;
let playerSize = 44;

let wolfX = 500;
let wolfY = 280;

let score = 0;
let gameStarted = false;
let gameOver = false;
let youWin = false;

let mushrooms = [
  { x: 190, y: 180 },
  { x: 340, y: 300 },
  { x: 440, y: 150 },
  { x: 560, y: 230 },
  { x: 240, y: 350 }
];

function setup() {
  let canvas = createCanvas(720, 420);
  canvas.parent("game-container");
}

function draw() {

  // Background
  if (youWin == true) {
    background(255, 220, 0);
  } else if (gameOver == true) {
    background(200, 50, 50);
  } else {
    background(100, 180, 80);
  }

  drawTrees();

  // Draw mushrooms
  for (let i = 0; i < mushrooms.length; i++) {
    drawMushroom(mushrooms[i].x, mushrooms[i].y);
  }

  drawPlayer();
  drawWolf();

  // Game is running
  if (gameOver == false && youWin == false) {

    // Move player
    if (keyIsDown(RIGHT_ARROW)) {
      playerX = playerX + 4;
    }

    if (keyIsDown(LEFT_ARROW)) {
      playerX = playerX - 4;
    }

    if (keyIsDown(UP_ARROW)) {
      playerY = playerY - 4;
    }

    if (keyIsDown(DOWN_ARROW)) {
      playerY = playerY + 4;
    }

    // Collect mushrooms
    for (let i = mushrooms.length - 1; i >= 0; i--) {

      let d = dist(
        playerX,
        playerY,
        mushrooms[i].x,
        mushrooms[i].y
      );

      if (d < 35) {
        mushrooms.splice(i, 1);
        score = score + 1;
        gameStarted = true;
      }
    }

    // Win after collecting all 5 mushrooms
    if (mushrooms.length == 0) {
      youWin = true;
    }

    // Move wolf
    if (youWin == false) {

      if (wolfX < playerX) {
        wolfX = wolfX + 0.5;
      }

      if (wolfX > playerX) {
        wolfX = wolfX - 0.5;
      }

      if (wolfY < playerY) {
        wolfY = wolfY + 0.5;
      }

      if (wolfY > playerY) {
        wolfY = wolfY - 0.5;
      }

      // Wolf touches player
      let wolfDistance = dist(
        playerX,
        playerY,
        wolfX,
        wolfY
      );

      if (wolfDistance < 40 && score > 0) {
        score = score - 1;

        // Move wolf away
        wolfX = 650;
        wolfY = 80;
      }

      // Game Over
      if (gameStarted == true && score == 0) {
        gameOver = true;
      }
    }
  }

  // Show points
  fill(0);
  textSize(20);
  text("Points: " + score, 20, 30);

  // Win message
  if (youWin == true) {
    fill(0);
    textSize(40);
    text("You Win!", 280, 210);
  }

  // Game Over message
  if (gameOver == true) {
    fill(255);
    textSize(40);
    text("Game Over!", 250, 210);
  }
}

function drawTrees() {
  noStroke();

  // Tree 1
  fill(120, 70, 30);
  rect(70, 80, 20, 50);

  fill(20, 120, 50);
  circle(80, 70, 70);

  // Tree 2
  fill(120, 70, 30);
  rect(620, 300, 20, 50);

  fill(20, 120, 50);
  triangle(630, 250, 590, 320, 670, 320);
}

function drawPlayer() {
  noStroke();

  // Face
  fill(255, 220, 180);
  circle(playerX, playerY, playerSize);

  // Eyes
  fill(0);
  circle(playerX - 8, playerY - 5, 5);
  circle(playerX + 8, playerY - 5, 5);

  // Mouth
  stroke(0);
  line(
    playerX - 6,
    playerY + 8,
    playerX + 6,
    playerY + 8
  );
}

function drawWolf() {
  noStroke();

  fill(100);
  triangle(
    wolfX,
    wolfY - 30,
    wolfX - 30,
    wolfY + 30,
    wolfX + 30,
    wolfY + 30
  );

  // Eyes
  fill(0);
  circle(wolfX - 10, wolfY, 5);
  circle(wolfX + 10, wolfY, 5);
}

function drawMushroom(x, y) {
  noStroke();

  // Stem
  fill(245, 220, 180);
  rect(x, y, 20, 30, 5);

  // Top
  fill(200, 40, 40);
  arc(x + 10, y, 50, 40, PI, TWO_PI);
}