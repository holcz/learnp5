var field = null;
var breaker = null;
var balls = [];
var bricks = [];
var states = {
  START:0,
  PLAY:1,
  WIN: 2,
  GAMEOVER:3
}
var state = states.START;

function setup() {
  createCanvas(800, 400);
  frameRate(30);
  init();
}

function Field() {
  this.position = createVector(0,0);
  this.thickness = 5;
  this.width = 800;
  this.height = 400 + this.thickness;

  this.draw = function() {
    push();
    noFill();
    strokeWeight(this.thickness);
    rect(this.position.x, this.position.y, this.width, this.height);
    pop();
  }

  this.collide = function(ball) {
    if (this.isColledingLeft(ball) || this.isColledingRight(ball)) {
      ball.bounce('v');
    }
    if (this.isColledingTop(ball)) {
      ball.bounce('h');
    }
    if (this.isColledingBottom(ball)) {
      state = states.GAMEOVER;
    }
  }

  this.isColledingTop = function(ball) {
    return ball.position.y <= this.position.y + this.thickness;
  }

  this.isColledingBottom = function(ball) {
    return ball.position.y >= this.position.y + this.height - this.thickness;
  }

  this.isColledingRight = function(ball) {
    return ball.position.x >= this.position.x + this.width - this.thickness;
  }

  this.isColledingLeft = function(ball) {
    return ball.position.x <= this.position.x + this.thickness;
  }

}

function Breaker() {
  this.position = createVector(360, 370);
  this.width = 70;
  this.height = 10;
  this.speed = createVector(5,0);

  this.draw = function() {
    rect(this.position.x, this.position.y, this.width, this.height);
  }

  this.collide = function(ball) {
    if (isColliding(this, ball)) {
      ball.bounce('h');
    }
  }

  this.update = function() {
    if (keyIsDown(LEFT_ARROW)) {
      this.position.sub(this.speed);
    }
    if (keyIsDown(RIGHT_ARROW)) {
      this.position.add(this.speed);
    }
  }
}

function Ball(x, y, speed, size) {
    this.width = this.height = size ? size : 10;
    this.speedVector = createVector(4, 5);
    this.position = createVector(x, y);

    this.draw = function() {
      ellipse(this.position.x, this.position.y, this.width);
    }

    this.move = function () {
      this.position.add(this.speedVector);
    }

    this.collide = function(ball) {
      if (isColliding(this, ball)) {
        ball.bounce('h');
      }
    }

    this.isOut = function() {
      return (this.position.x <= 0 || this.position.x >= 800 ||
        this.position.y <= 0 || this.position.y >= 400);
    }

    this.bounce = function(orientation) {
      if (orientation == 'v') {
          this.speedVector.x = -this.speedVector.x;
      } else {
        this.speedVector.y = -this.speedVector.y;
      }
    }
}

function Brick(x, y, width, height) {
    this.position = createVector(x, y);
    this.width = width ? width : 32;
    this.height = height ? height : 20;
    this.alive = true;

    this.draw = function() {
      fill(255,255,255);
      rect(this.position.x, this.position.y, this.width, this.height);
    }

    this.collide = function(ball) {
      if (this.isColledingLeft(ball) || this.isColledingRight(ball)) {
        ball.bounce('v');
        this.alive = false;
      }

      if (this.isColledingTop(ball) || this.isColledingBottom(ball)) {
        ball.bounce('h');
        this.alive = false;
      }
    }

    this.isColledingTop = function(ball) {
      return isColliding(ball, new Element(this.position.x, this.position.y, this.width, 1));
    }

    this.isColledingBottom = function(ball) {
      return isColliding(ball, new Element(this.position.x , this.position.y + this.height, this.width, 1));
    }

    this.isColledingRight = function(ball) {
      return isColliding(ball, new Element(this.position.x + this.width, this.position.y, 1, this.height));
    }

    this.isColledingLeft = function(ball) {
      return isColliding(ball, new Element(this.position.x, this.position.y, 1, this.height));
    }
}

function Element(x, y, width, height) {
  this.position = createVector(x,y);
  this.width = width;
  this.height = height;
}

function isColliding(a, b) {
  for (ax = a.position.x; ax < a.position.x + a.width; ax++) {
    for (ay = a.position.y; ay < a.position.y + a.height; ay++) {
      if (ax >= b.position.x && ax < b.position.x + b.width &&
        ay >= b.position.y && ay <= b.position.y + b.height) {
        return true;
      }
    }
  }
}

function init() {
  initField();
  initBricks();
  initBalls();
  initBreaker();
}

function initField() {
  field = new Field();
}

function initBricks() {
  bricks = [];
  for (i=0; i < 25*32; i+=32) {
    for (j=0; j < 5*20; j+=20) {
      bricks.push(new Brick(i, j))
    }
  }
}

function initBalls() {
  balls = [];
  balls.push(new Ball(400, 200));
}

function initBreaker() {
  breaker = new Breaker();
}

function start() {
  background(220);
  fill(0, 0, 0);
  textSize(32);
  text("BREAKOUT", 300, 200);
  if (keyIsDown(32)) {
    state = states.PLAY;
  }
}

function play() {
  background(220);
  fill(0, 0, 0);
  field.draw();
  breaker.update();
  breaker.draw();
  balls.forEach((ball, index) => {
    breaker.collide(ball);
    field.collide(ball);
    bricks.forEach((brick, index) => {
      brick.collide(ball);
      if (!brick.alive) {
        bricks.splice(index, 1);
      }
    });
    ball.move();
    ball.draw();
  });
  bricks.forEach((brick, index) => {
      brick.draw();
  });
  if (!balls.length) {
    state = states.GAMEOVER;
  }
}

function gameover() {
  background(220);
  fill(0, 0, 0);
  textSize(32);
  text("GAME OVER", 300, 200);
  if (keyIsDown(32)) {
    state = states.PLAY;
    init();
  }
}

function win() {
  background(220);
  fill(0, 0, 0);
  textSize(32);
  text("NICEEEEE", 300, 200);
  if (keyIsDown(32)) {
    state = states.PLAY;
    init();
  }
}

function draw() {
  switch (state) {
    case states.PLAY:
      play();
      break;
    case states.WIN:
      win();
      break;
    case states.GAMEOVER:
      gameover();
      break;
    case states.START:
      start();
      break;
  }
}
