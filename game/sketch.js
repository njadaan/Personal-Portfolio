let playerX = 100;
let playerY = 320;
let playerSize = 44;

let wolfX = 500;
let wolfY = 280;

let score = 0;
let gameStarted = false;
let gameOver = false;
let youWin = false;

let draggingPlayer = false;
let activePointerId = null;
let winSoundPlayed = false;
let loseSoundPlayed = false;

const initialMushrooms = [
  { x: 190, y: 180 },
  { x: 340, y: 300 },
  { x: 440, y: 150 },
  { x: 560, y: 230 },
  { x: 240, y: 350 }
];

let mushrooms = initialMushrooms.map((m) => ({ ...m }));

function setup() {
  let canvas = createCanvas(720, 420);
  canvas.parent("game-container");

  const element = canvas.elt;
  element.style.touchAction = "none";

  element.addEventListener("pointerdown", handlePointerDown, {
    passive: false
  });

  element.addEventListener("pointermove", handlePointerMove, {
    passive: false
  });

  element.addEventListener("pointerup", handlePointerUp, {
    passive: false
  });

  element.addEventListener("pointercancel", handlePointerUp, {
    passive: false
  });
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

    // Desktop keyboard controls
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

    keepPlayerInsideCanvas();

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

    // Win
    if (mushrooms.length == 0) {
      youWin = true;

      if (!winSoundPlayed) {
        playWinSound();
        winSoundPlayed = true;
      }
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

        wolfX = 650;
        wolfY = 80;
      }

      // Game Over
      if (gameStarted == true && score == 0) {
        gameOver = true;

        if (!loseSoundPlayed) {
          playLoseSound();
          loseSoundPlayed = true;
        }
      }
    }
  }

  // Points
  fill(0);
  noStroke();
  textSize(20);
  text("Points: " + score, 20, 30);

  // Win message
  if (youWin == true) {
    fill(0);
    textAlign(CENTER, CENTER);
    textSize(40);
    text("You Win!", width / 2, height / 2);

    textSize(18);
    text("Tap to restart", width / 2, height / 2 + 45);

    textAlign(LEFT, BASELINE);
  }

  // Game Over message
  if (gameOver == true) {
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(40);
    text("Game Over!", width / 2, height / 2);

    textSize(18);
    text("Tap to restart", width / 2, height / 2 + 45);

    textAlign(LEFT, BASELINE);
  }
}


// MOBILE + MOUSE DRAG

function handlePointerDown(event) {
  event.preventDefault();

  unlockAudio();

  // Tap after Win/Game Over = restart
  if (gameOver || youWin) {
    resetGame();
    return;
  }

  const point = pointerToGameCoordinates(event);

  const d = dist(
    point.x,
    point.y,
    playerX,
    playerY
  );

  // Start dragging when player is touched
  if (d <= playerSize * 1.2) {
    draggingPlayer = true;
    activePointerId = event.pointerId;

    if (event.currentTarget.setPointerCapture) {
      event.currentTarget.setPointerCapture(event.pointerId);
    }

    movePlayerTo(point.x, point.y);
  }
}

function handlePointerMove(event) {
  if (
    !draggingPlayer ||
    event.pointerId !== activePointerId
  ) {
    return;
  }

  event.preventDefault();

  const point = pointerToGameCoordinates(event);

  movePlayerTo(point.x, point.y);
}

function handlePointerUp(event) {
  if (event.pointerId !== activePointerId) {
    return;
  }

  event.preventDefault();

  draggingPlayer = false;
  activePointerId = null;
}

function pointerToGameCoordinates(event) {
  const rect =
    event.currentTarget.getBoundingClientRect();

  return {
    x:
      (event.clientX - rect.left) *
      (width / rect.width),

    y:
      (event.clientY - rect.top) *
      (height / rect.height)
  };
}

function movePlayerTo(x, y) {
  playerX = x;
  playerY = y;

  keepPlayerInsideCanvas();
}

function keepPlayerInsideCanvas() {
  const radius = playerSize / 2;

  playerX = constrain(
    playerX,
    radius,
    width - radius
  );

  playerY = constrain(
    playerY,
    radius,
    height - radius
  );
}


// RESTART

function keyPressed() {
  unlockAudio();

  if (key === "r" || key === "R") {
    resetGame();
  }

  // Prevent arrow keys from scrolling page
  if (
    keyCode === LEFT_ARROW ||
    keyCode === RIGHT_ARROW ||
    keyCode === UP_ARROW ||
    keyCode === DOWN_ARROW
  ) {
    return false;
  }
}

function resetGame() {
  playerX = 100;
  playerY = 320;

  wolfX = 500;
  wolfY = 280;

  score = 0;

  gameStarted = false;
  gameOver = false;
  youWin = false;

  mushrooms =
    initialMushrooms.map((m) => ({ ...m }));

  draggingPlayer = false;
  activePointerId = null;

  winSoundPlayed = false;
  loseSoundPlayed = false;
}


// SOUND

function unlockAudio() {
  const AudioContextClass =
    window.AudioContext ||
    window.webkitAudioContext;

  if (!AudioContextClass) {
    return null;
  }

  if (!window.gameAudioContext) {
    window.gameAudioContext =
      new AudioContextClass();
  }

  if (
    window.gameAudioContext.state ===
    "suspended"
  ) {
    window.gameAudioContext.resume();
  }

  return window.gameAudioContext;
}

function playTone(
  frequency,
  startTime,
  duration,
  type = "sine",
  volume = 0.12
) {
  const audioContext = unlockAudio();

  if (!audioContext) {
    return;
  }

  const oscillator =
    audioContext.createOscillator();

  const gain =
    audioContext.createGain();

  oscillator.type = type;

  oscillator.frequency.setValueAtTime(
    frequency,
    startTime
  );

  gain.gain.setValueAtTime(
    0.0001,
    startTime
  );

  gain.gain.exponentialRampToValueAtTime(
    volume,
    startTime + 0.02
  );

  gain.gain.exponentialRampToValueAtTime(
    0.0001,
    startTime + duration
  );

  oscillator.connect(gain);
  gain.connect(audioContext.destination);

  oscillator.start(startTime);

  oscillator.stop(
    startTime + duration + 0.03
  );
}


// WIN SOUND

function playWinSound() {
  const audioContext = unlockAudio();

  if (!audioContext) {
    return;
  }

  const now =
    audioContext.currentTime;

  playTone(
    523.25,
    now,
    0.18,
    "sine",
    0.11
  );

  playTone(
    659.25,
    now + 0.16,
    0.18,
    "sine",
    0.11
  );

  playTone(
    783.99,
    now + 0.32,
    0.28,
    "sine",
    0.13
  );
}


// GAME OVER SOUND

function playLoseSound() {
  const audioContext = unlockAudio();

  if (!audioContext) {
    return;
  }

  const now =
    audioContext.currentTime;

  playTone(
    220,
    now,
    0.22,
    "sawtooth",
    0.08
  );

  playTone(
    174.61,
    now + 0.18,
    0.24,
    "sawtooth",
    0.07
  );

  playTone(
    130.81,
    now + 0.36,
    0.35,
    "sawtooth",
    0.06
  );
}


// TREES

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
  triangle(
    630,
    250,
    590,
    320,
    670,
    320
  );
}


// PLAYER

function drawPlayer() {
  noStroke();

  fill(255, 220, 180);
  circle(
    playerX,
    playerY,
    playerSize
  );

  // Eyes
  fill(0);

  circle(
    playerX - 8,
    playerY - 5,
    5
  );

  circle(
    playerX + 8,
    playerY - 5,
    5
  );

  // Mouth
  stroke(0);

  line(
    playerX - 6,
    playerY + 8,
    playerX + 6,
    playerY + 8
  );
}


// WOLF

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

  circle(
    wolfX - 10,
    wolfY,
    5
  );

  circle(
    wolfX + 10,
    wolfY,
    5
  );
}


// MUSHROOM

function drawMushroom(x, y) {
  noStroke();

  // Stem
  fill(245, 220, 180);

  rect(
    x,
    y,
    20,
    30,
    5
  );

  // Top
  fill(200, 40, 40);

  arc(
    x + 10,
    y,
    50,
    40,
    PI,
    TWO_PI
  );
}