var pongPositionX = 200;

function setup() {
  createCanvas(800, 400);
}

function draw() {
  if (keyIsDown(LEFT_ARROW))
    pongPositionX-=3;

  if (keyIsDown(RIGHT_ARROW))
    pongPositionX+=3;

  background(220);
  rect(pongPositionX, 360, 70, 10);
}
