const intialBoard = {
  board: null,
  boardHeight: 300,
  boardWidth: 800,
  context: null,
};

const intialDino = {
  dinoWidth: 90,
  dinoHeight: 95,
  dinoX: 50,
  dinoY: intialBoard.boardHeight - 95,
  dinoImg: null,
};

const dino = {
  x: intialDino.dinoX,
  y: intialDino.dinoY,
  width: intialDino.dinoWidth,
  height: intialDino.dinoHeight,
  speed: 0,
  gravity: 0.45,
};

let cactusArray = [];

const initialCactus = {
  cactus1Width: 35,
  cactus2Width: 70,
  cactus3Width: 100,
  cactusHeight: 70,
  cactusX: 750,
  cactusY: intialBoard.boardHeight - 70,
};

let cactus;

let animationId;

let gameStarted = false;

let score = 0;

window.onload = function () {
  document.addEventListener(
    'keydown',
    (e) => {
      if (e.code === 'Space') {
        requestAnimationFrame(update);
        gameStarted = true;
        document.querySelector('main').classList.remove('hide');
        document.querySelector('.start-screen').classList.add('hide');
      }
    },
    { once: true }
  );

  startGame();
};

function startGame() {
  intialBoard.board = document.getElementById('board');
  intialBoard.board.height = intialBoard.boardHeight;
  intialBoard.board.width = intialBoard.boardWidth;

  intialBoard.context = intialBoard.board.getContext('2d');

  initDino();
  initCactuses();
}

function initDino() {
  intialDino.dinoImg = new Image();
  intialDino.dinoImg.src = './images/dino-run-1.png';

  intialDino.dinoImg.onload = function () {
    drawDino();
  };
}

function drawDino() {
  dino.speed += dino.gravity;
  dino.y = Math.min(dino.y + dino.speed, intialDino.dinoY);
  intialBoard.context.drawImage(
    intialDino.dinoImg,
    dino.x,
    dino.y,
    dino.width,
    dino.height
  );
}

function initCactuses() {
  const cactusImages = {
    1: ((c1 = new Image()), (c1.src = './images/cactus1.png'), c1),
    2: ((c2 = new Image()), (c2.src = './images/cactus2.png'), c2),
    3: ((c3 = new Image()), (c3.src = './images/cactus3.png'), c3),
  };

  cactusArray = new Array(3).fill(0).map((e, index) => {
    return {
      x: initialCactus.cactusX,
      y: initialCactus.cactusY,
      width: initialCactus[`cactus${index + 1}Width`],
      height: initialCactus.cactusHeight,
      img: cactusImages[index + 1],
    };
  });
}

function drawCactus() {
  cactus.x += -5;

  intialBoard.context.drawImage(
    cactus.img,
    cactus.x,
    cactus.y,
    cactus.width,
    cactus.height
  );
}

function update() {
  animationId = requestAnimationFrame(update);

  intialBoard.context.clearRect(0, 0, board.width, board.height);

  setInterval(() => {
    const randImgIndex =
      intialDino.dinoImg.attributes[0].nodeValue === './images/dino-run-1.png'
        ? 0
        : 1;

    intialDino.dinoImg = new Image();
    intialDino.dinoImg.src = `./images/dino-run-${randImgIndex}.png`;
  }, 250);

  drawDino();
  cactusPicker();
  drawCactus();
  collisionDetection();

  if (cactus?.x + cactus?.width === 45) {
    updateScore();
  }
}

document.addEventListener('keydown', dinoJump);

function dinoJump(event) {
  if (!gameStarted) return;

  const jumpSound = new Audio();
  jumpSound.src = './sounds/jump-sound.mp3';

  if (event.code === 'Space' || event.code === 'ArrowUp') {
    if (dino.y === intialDino.dinoY) {
      dino.speed = -11;
      jumpSound.play();
    }
  }
}

function cactusPicker() {
  if (cactus) {
    if (cactus.x < 0 - cactus?.width) {
      cactus.x = initialCactus.cactusX;
    } else {
      return;
    }
  }
  let random = Math.floor(Math.random() * cactusArray.length);

  cactus = cactusArray[random];
}

function collisionDetection() {
  const endGame_Sound = new Audio();
  endGame_Sound.src = './sounds/end-game.mp3';

  if (
    dino.x + dino.width / 1.8 >= cactus?.x &&
    dino.x <= cactus?.x + cactus?.width
  ) {
    if (dino.y + dino.height / 1.7 >= cactus?.y) {
      endGame_Sound.play();
      endGame();
    }
  }
}

function endGame() {
  cancelAnimationFrame(animationId);

  document.getElementById('end-score').innerHTML = score;
  document.querySelector('.end-screen').classList.remove('hide');
  document.querySelector('main').classList.add('hide');
  document.removeEventListener('keydown', dinoJump);

  document.addEventListener(
    'keydown',
    (e) => {
      if (e.code === 'Space') {
        window.location.reload();
      }
    },
    { once: true }
  );
}

function updateScore() {
  const scoreElement = document.getElementById('score');
  score += 1;
  scoreElement.innerHTML = score;
}
