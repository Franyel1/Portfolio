let padX = 150;


let ballX = 200;
let ballY = 90;

let ballSpeedX = 0;
let ballSpeedY = 0;

let t1X, t1Y;

let t2X, t2Y;
let t1Speed;
let t2Speed;

start = false;
let treasure;

let boing,collect,loss;

let r;
let g;
let b;

let rs =1;
let gs = 1;
let bs = 1;

let score = 0;
let back;
let fore;

let backY1 = -400;
let foreY1 = -400;

let backY2 = -1200;
let foreY2 = -1200;

let bod,hea,ins;

function borderWhite(){
    bod.style.border = "dashed white 4px";
    hea.style.borderBottom = "dashed white 4px";
    ins.style.borderTop = "dashed white 4px";
}

function borderGrey(){
    bod.style.border = "dashed grey 4px";
    hea.style.borderBottom = "dashed grey 4px";
    ins.style.borderTop = "dashed grey 4px";
}

function preload(){
    treasure = loadImage('images/treasure.png');
    boing = loadSound('sounds/boing.mp3');
    collect = loadSound('sounds/collect.mp3');
    loss = loadSound('sounds/loss.mp3');
    back = loadImage('images/background.png');
    fore = loadImage('images/foreground.png');
}

function setup(){
    canvas = createCanvas(400,400);

    canvas.parent("#canvasContainer");
    background(0);

    t2Y = random(90, 250);
    t1Y = random(90, 250);

    t2X = random(-100, -10);
    t1X = random( 410, 500);

    t1Speed = -2;
    t2Speed = 2;
    r = random(255);
    g = random(255);
    b = random(255);

    bod = document.getElementsByTagName("body")[0];
    hea = document.getElementsByTagName("h1")[0]; 
    ins = document.getElementById("instructions");

}

function draw(){
    background(0); 
    borderGrey();

    image(back, 0, backY1, 400, 800);
    image(back, 0, backY2, 400, 800);
    image(fore, 0, foreY1, 400, 800);
    image(fore, 0, foreY2, 400, 800);


    if (backY1 >= 400) {
        backY1 = backY2 - 800;
    }
    if (backY2 >= 400){
        backY2 = backY1 - 800;
    }

    if (foreY1 >= 400) {
        foreY1 = foreY2 - 800;
    }
    if (foreY2 >= 400){
        foreY2 = foreY1 - 800;
    }


    backY1 += 1; backY2 += 1;
    foreY1 += 2; foreY2 += 2;
    

    //pad
    fill(200);
    rect(padX, 390, 100,10);

    if (keyIsDown(65) && padX >= 12) { // left motion, 'A' key
        padX -= 5;
    }
    if (keyIsDown(68) && padX <= 288) {
        padX += 5;
    }

    //ball
    push();
    fill(r,g,b);
    ellipse(ballX, ballY, 40,40);
    pop();

    if (r >= 255 || r<=0){
        rs *=-1;
    }
    if (g >= 255 || g<=0){
        gs *=-1;
    }
    if (b >= 255 || b<0){ 
        bs *=-1;
    }
    r+=rs;
    b+=bs;
    g+=gs;

    if (ballX <= 32 || ballX>=368){
        ballSpeedX *=-1;
        ballSpeedY += 1.02
        ballSpeedX *= 1.02
        borderWhite();
        boing.play();
    }
    if (ballY <= 32){
        ballSpeedY *=-1;
        ballSpeedY += 1.02
        ballSpeedX *= 1.02
        borderWhite();
        boing.play();
    }
    
    
    if (ballY >= 370 && ballX+20 >= padX && ballX <=padX+120){ 
        ballSpeedY *=-1; 

        //farther from the center the more speed gained
        howFarFromCenter = abs(ballX - padX -50)/60; 
        ballSpeedX *= 1 + howFarFromCenter;

        ballY = 370; 

        borderWhite();
        boing.play(); 
    }


    ballX += ballSpeedX;
    ballY += ballSpeedY;

    if (ballY >= 390){
        ballX = 200;
        ballY = 90;

        ballSpeedX = 0;
        ballSpeedY = 0;
        start =false;

        loss.play();
    }

    if (mouseIsPressed && !start){
        start =true;
        ballSpeedX = random([ -1, 1 ]) * random(2, 4);
        ballSpeedY = random([ -1, 1 ]) * random(2, 4);
        // ballSpeedX = 1;
        // ballSpeedY = 3;
    }


    //treasures
    if (start){
        image(treasure, t1X, t1Y, 50,50);
        image(treasure, t2X, t2Y, 50,50);


        if (t1X <= -100){
            t1X = random( 410, 500);
            t1Y = random(90, 250);
        }

        if (t2X >= 450){
            t2X = random(-100, -10);
            t2Y = random(90, 250);
        }

        t1X += t1Speed;
        t2X += t2Speed;
    }

    if (dist(ballX, ballY, t1X + 25, t1Y + 25) <= 45){
        t1X = random( 410, 500);
        t1Y = random(90, 250);
        score ++;
        collect.play();
    }

    if (dist(ballX, ballY, t2X + 25, t2Y + 25) <= 45){
        t2X = random(-100, -10);
        t2Y = random(90, 250);
        score++;
        collect.play();
    }

    fill(255);
    textSize(20);
    text("Points: "+score, 50 ,50)

    //border
    noStroke();
    push();
    stroke(150);
    strokeWeight(20); 
    line(0,0, 0,400);
    line(0,0, 400,0);
    line(400,0, 400,400);
    pop();
}
