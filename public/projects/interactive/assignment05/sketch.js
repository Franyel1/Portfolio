

// setup function - used for commands that need to run only once
//make an empty arrya of boxes
fallingObjects = [];
let ground, wall1, wall2, wall3;
let bumper1, bumper2;
let ramp1, ramp2, ramp3, ramp4;
let ramp1Size = 400, ramp2Size = 400, ramp3Size = 220, ramp4Size = 220;

let player;
let playerX = 300;

let cupStart, cupMiddle, cupEnd;

let billValues = [1, 5, 10, 20, 100];
let billSizes = { 1: 50, 5: 55, 10: 60, 20: 65, 100: 75 };

let moneyIMG, manIMG, backgroundIMG,bumperIMG, rampIMG, homeBackgroundIMG;

let ramp1Y = 250;
let ramp2Y = 400;


let bumper1X = 150;
let bumper2X = 370;

let canvas;
function setup() {
    canvas = createCanvas(550, 800);
    canvas.parent(document.getElementById('canvasContainer'));

    // Create a Matter.js physics engine
    // This sets up the physics simulation environment
    engine = Matter.Engine.create();


    moneyIMG = loadImage("media/money.png");
    manIMG = loadImage("media/man.png");
    backgroundIMG = loadImage("media/background.png");
    bumperIMG = loadImage("media/bumper.png");
    rampIMG = loadImage("media/ramp.png");
    homeBackgroundIMG = loadImage("media/homeBackground.png");

    // Set gravity in our engine to pull objects downward
    engine.gravity.y = .5;

    // for (let i = 0; i < 20; i++) {
    //     let value = random(billValues);
    //     let sizeFactor = billSizes[value];

    //     let air = random(0.004, 0.01) / (value/5);
    //     let dens = random(0.04, 0.08) * (value/5);

    //     let box = Matter.Bodies.rectangle(random(50, 450), random(-200, -50), sizeFactor, sizeFactor/2,
    //         {
    //             frictionAir: air,
    //             density: dens,
    //             restitution: 0.2,
    //             angle: random(-PI, PI),
    //             customInfo: {
    //                 size: sizeFactor,

    //                 r: random(120, 255),
    //                 g: random(200, 255),
    //                 b: random(120, 180),

    //                 type: "obj",
    //                 collected: false,
    //                 enterTime: 0,
    //                 value: value
    //             }
    //         }
    //     );

    //     Matter.Composite.add(engine.world, box);
    //     fallingObjects.push(box);
    // }

    //make 2 movable ramps
    
    ramp1 = Matter.Bodies.rectangle(550, ramp1Y, ramp1Size, 20, {
        isStatic: true, angle: -PI / 6,
        customInfo: {
            type: "ramp"
        }
    });
    ramp2 = Matter.Bodies.rectangle(0, ramp2Y, ramp2Size, 20, {
        isStatic: true, angle: PI / 6,
        customInfo: {
            type: "ramp"
        }
    });

    
    Matter.Composite.add(engine.world, [ ramp1, ramp2 /*, ramp3, ramp4*/ ]);

    //bumpers
    bumper1 = Matter.Bodies.circle(bumper1X, 180, 30, { 
        isStatic: true,
        restitution: 4,
        customInfo: {
            type: "bumper"
        }
    });
    bumper2 = Matter.Bodies.circle(bumper2X, 500, 30, { 
        isStatic: true,
        restitution: 4,
        customInfo: {
            type: "bumper"
        }
    });
    Matter.Composite.add(engine.world, [bumper1, bumper2]);
    
    
    // Next let's add some ground so the box has something to land on
    // Here we are passing in an object with the property isStatic set to true. This makes the ground immovable.
    // ground = Matter.Bodies.rectangle(500, 800, 100, 20, {
    //     isStatic: true, 
    //     customInfo: {
    //         type: "ground"
    //     }
    // });

    wall1 = Matter.Bodies.rectangle(0, 400, 20, 16000, {
        isStatic: true, customInfo: {
            type: "wall"
        }
    });
    wall2 = Matter.Bodies.rectangle(550, 400, 20, 16000, {
        isStatic: true, customInfo: {
            type: "wall"
        }
    });


    Matter.Composite.add(engine.world, [wall1, wall2]);


    //player
    player = Matter.Bodies.rectangle(playerX, 700, 50, 50, {
        frictionAir: 0.05,
        density: 0.02,
        isStatic: true,
        customInfo: {
            size: 40,
            r: 255,
            g: 255,
            b: 255,
            type: "player"
        }

    });
    Matter.Composite.add(engine.world, player);

    cupStart = Matter.Bodies.rectangle(playerX-40, 640, 50, 20, {
        isStatic: true,
        angle: PI / 3,
        customInfo: {
            type: "cup"
        }
    });
    cupMiddle = Matter.Bodies.rectangle(playerX, 655, 80, 20, {
        isStatic: true,
        customInfo: {
            type: "cup"
        }
    });
    cupEnd = Matter.Bodies.rectangle(playerX+40, 640, 50, 20, {
        isStatic: true,
        angle: -PI / 3,
        customInfo: {
            type: "cup"
        }
    });
    Matter.Composite.add(engine.world,[cupStart, cupMiddle, cupEnd]);
    

    //Matter.Composite.add(engine.world, ground);
    Matter.Events.on(engine, 'collisionStart', handleCollisionStart);
    Matter.Events.on(engine, 'collisionEnd', handleCollisionEnd);

    rectMode(CENTER);
    imageMode(CENTER);
    noStroke();
}


// draw function - used for commands that need to be repeated

let ramp1State = "none";
let ramp1Counter = 0;
let ramp2State = "none";
let ramp2Counter = 0;

let angleSpeed;

let timeLeft = 60;
let score =0;

let smokeParticles = [];
let moneyParticles = [];

let r1s = -2;
let r2s = 3;

let gameState = "home";
function draw() {


    if (gameState === "game") {
        drawGame();
    } else if (gameState === "gameover") {
        background(0, 10);
        fill(255);
        textAlign(CENTER, CENTER);
        textSize(38);

        text("Game Over", width / 2, height / 2 - 80);
        text("You Made $" + score, width / 2, height / 2 +50);

        //reset game button
        rect(width / 2, height / 2 + 150, 200, 50);
        fill(0);
        textSize(24);
        text("Home", width / 2, height / 2 + 150);

        if (mouseX > width / 2 - 100 && mouseX < width / 2 + 100 && mouseY > height / 2 + 125 && mouseY < height / 2 + 175) {
            //reset game button
            fill(150);
            rect(width / 2, height / 2 + 150, 200, 50);
            textSize(24);
            fill(255)
            text("Home", width / 2, height / 2 + 150);

            if (mouseIsPressed) {
                //reset
                timeLeft = 60;
                score = 0;
                fallingObjects = [];
                smokeParticles = [];
                moneyParticles = [];
                playerX = 300;
                Matter.Body.setPosition(player, { x: playerX, y: player.position.y });
                gameState = "home";
            }
        }

    } else {
        background(0);
        image(homeBackgroundIMG, width / 2, height / 2, width+100, height+70);
        fill(255);
        textAlign(CENTER, CENTER);
        stroke("gray");
        strokeWeight(10);
        textSize(35);

        text("Regain Your", width / 2, height / 2 - 50);
        text("Retirement Money!", width / 2, height / 2);
        textSize(24);
        text("Click to Start", width / 2, height / 2 + 100);

        noStroke();

    }

}

function mousePressed() {
    if (gameState== "home") {
        gameState = "game";
    }
}

let b1s = 2;
let b2s = -2;

let windBar = 120;

let windParticles = [];
function drawGame(){
    background(0);

    image(backgroundIMG, width / 2, height / 2, width, height);

    //timer
    if ((frameCount % 60 == 0) && timeLeft > 0) {
        timeLeft--;
    }

    //add moneys
    if ((frameCount % 60 == 0 || frameCount % 30 == 0 || frameCount % 120 == 0 && timeLeft > 0) && timeLeft > 0) {
        let value = random(billValues);
        let sizeFactor = billSizes[value];

        let air = random(0.004, 0.01) / (value / 5);
        let dens = random(0.04, 0.08) * (value / 5);

        let box = Matter.Bodies.rectangle(random(50, 450), random(-200, -50), sizeFactor, sizeFactor / 2,
            {
                frictionAir: air,
                density: dens,
                restitution: 0.2,
                angle: random(-PI, PI),
                customInfo: {
                    size: sizeFactor,

                    r: random(120, 255),
                    g: random(200, 255),
                    b: random(120, 180),


                    type: "obj",
                    collected: false,
                    enterTime: 0,
                    value: value
                }
            }
        );

        Matter.Composite.add(engine.world, box);
        fallingObjects.push(box);
    }

    //cup
    push();
    translate(player.position.x - 40, 640);
    rotate(cupStart.angle);
    fill(255, 255, 0);
    rect(0, 0, 50, 20);
    pop();

    push();
    translate(player.position.x, 655);

    fill(255, 255, 0);
    rect(0, 0, 75, 20);
    pop();

    push();
    translate(player.position.x + 40, 640);

    rotate(cupEnd.angle);
    fill(255, 255, 0);
    rect(0, 0, 50, 20);
    pop();

    //move cup
    Matter.Body.setPosition(cupStart, { x: player.position.x - 40, y: 640 });
    Matter.Body.setPosition(cupMiddle, { x: player.position.x, y: 655 });
    Matter.Body.setPosition(cupEnd, { x: player.position.x + 40, y: 640 });

    angleSpeed = radians(3);



    //ramp1


    if (ramp1State == "down") {
        ramp1.angle -= angleSpeed;
        ramp1Counter++;
        if (ramp1Counter >= 12) {
            ramp1State = "none";
            ramp1Counter = 0;
        }
    }

    if (ramp1State == "up") {
        ramp1.angle += angleSpeed;
        ramp1Counter++;
        if (ramp1Counter >= 12) {
            ramp1State = "down";
            ramp1Counter = 0;
        }
    }

    //ramp2

    if (ramp2State == "down") {
        ramp2.angle += angleSpeed;
        ramp2Counter++;
        if (ramp2Counter >= 12) {
            ramp2State = "none";
            ramp2Counter = 0;
        }
    }

    if (ramp2State == "up") {
        ramp2.angle -= angleSpeed;
        ramp2Counter++;
        if (ramp2Counter >= 12) {
            ramp2State = "down";
            ramp2Counter = 0;
        }
    }

    Matter.Body.setAngle(ramp1, ramp1.angle);
    Matter.Body.setAngle(ramp2, ramp2.angle);

    Matter.Body.setPosition(ramp1, { x: 550, y: ramp1Y });
    Matter.Body.setPosition(ramp2, { x: 0, y: ramp2Y });

    ramp1Y += r1s;
    ramp2Y += r2s;

    if (ramp1Y > 350 || ramp1Y < 50) {
        r1s *= -1;
    }
    if (ramp2Y > 450 || ramp2Y < 250) {
        r2s *= -1;
    }

    //ramp1
    fill(0, 255, 0);
    push();
    translate(ramp1.position.x, ramp1.position.y);
    rotate(ramp1.angle);
    rect(0, 0, ramp1Size, 20);
    image(rampIMG, 0, 0, ramp1Size, 20);
    pop();

    //ramp2
    fill(0, 0, 255);
    push();
    translate(ramp2.position.x, ramp2.position.y);
    rotate(ramp2.angle);
    rect(0, 0, ramp2Size, 20);
    image(rampIMG, 0,0,ramp1Size, 20);
    pop();


    //walls
    fill(50);
    rect(wall1.position.x, wall1.position.y, 20, 800);
    rect(wall2.position.x, wall2.position.y, 20, 800);




    // Draw the boxes
    for (let i = fallingObjects.length - 1; i >= 0; i--) {

        //collection
        if (fallingObjects[i].customInfo.collected && fallingObjects[i].customInfo.cupEnterTime && millis() - fallingObjects[i].customInfo.cupEnterTime > 500 && timeLeft > 0) {
            Matter.Composite.remove(engine.world, fallingObjects[i]);
            fallingObjects.splice(i, 1);
            score += fallingObjects[i].customInfo.value;

            for (let j = 0; j < 5; j++) {
                moneyParticles.push(new Money(player.position.x - random(-40, 40), player.position.y - 50 + random(-20, 10), fallingObjects[i].customInfo.value));
            }
            continue;
        }

        //delete objects that fall off
        if (fallingObjects[i].position.y > height + 500) {
            Matter.Composite.remove(engine.world, fallingObjects[i]);
            fallingObjects.splice(i, 1);
            continue;
        }

        noStroke();

        fill(fallingObjects[i].customInfo.r, fallingObjects[i].customInfo.g, fallingObjects[i].customInfo.b);


        push();
        translate(fallingObjects[i].position.x, fallingObjects[i].position.y);
        rotate(fallingObjects[i].angle);
        rect(0, 0, fallingObjects[i].customInfo.size, fallingObjects[i].customInfo.size / 2);
        image(moneyIMG, 0, 0, fallingObjects[i].customInfo.size, fallingObjects[i].customInfo.size / 2);

        textAlign(CENTER, CENTER);
        fill(0);
        textSize(12);
        text(fallingObjects[i].customInfo.value, 0, 0);
        pop();

    }



    //bumpers
    fill(255, 0, 255);
    ellipse(bumper1.position.x, bumper1.position.y, 60);
    ellipse(bumper2.position.x, bumper2.position.y, 60);

    image(bumperIMG, bumper1.position.x, bumper1.position.y, 60, 60);
    image(bumperIMG, bumper2.position.x, bumper2.position.y, 60, 60);

    //move bumper
    Matter.Body.setPosition(bumper1, { x: bumper1X + 50 * sin(frameCount * 0.02), y: bumper1.position.y });
    Matter.Body.setPosition(bumper2, { x: bumper2X + 50 * sin(frameCount * 0.02 + PI), y: bumper2.position.y });

    bumper1X += b1s;
    bumper2X += b2s;
    
    if (bumper1X < 100 || bumper1X > 200) {
        b1s *= -1;
    }
    if (bumper2X < 320 || bumper2X > 420) {
        b2s *= -1;
    }

    //player
    push();
    translate(player.position.x, player.position.y);
    image(manIMG, 0, 0, 90, 90);
    pop();

    //draw particles
    for (let i = 0; i < smokeParticles.length; i++) {
        let p = smokeParticles[i];
        if (!p.drawAndmove()) {
            smokeParticles.splice(i, 1);
            i--;
        }
    }

    //draw money perticles
    for (let i = 0; i < moneyParticles.length; i++) {
        let p = moneyParticles[i];
        if (!p.drawAndMove()) {
            moneyParticles.splice(i, 1);
            i--;
        }
    }

    if (keyIsDown(RIGHT_ARROW)) {
        playerX += 8;
    }
    if (keyIsDown(LEFT_ARROW)) {
        playerX -= 8;
    }

    let tmp = new Smoke(player.position.x, player.position.y + 15);
    smokeParticles.push(tmp);
    

    playerX = constrain(playerX, 65, 480);
    Matter.Body.setPosition(player, { x: playerX, y: player.position.y });


    if (timeLeft <= 0) {
        gameState = "gameover";
    } else {
        fill(0, 100);
        rect(width/2, 75, 210, 110);
        fill(255);
        textSize(32);
        textAlign(CENTER, CENTER);
        text("Time Left: " + timeLeft, width / 2, 50);

        textAlign(CENTER, CENTER);
        text("$" + score, width / 2, 100);
    }

    let windPressed = false;
    //space float
    if (keyIsDown(32) && windBar >= 15) {
        windBar -= 3;
        for (let i = 0; i < fallingObjects.length; i++) {
            let obj = fallingObjects[i];

            Matter.Body.applyForce(obj, obj.position, { x: 0, y: -6 * obj.density });
        }
        windPressed = true;

        for (let i = 0; i < 5; i++) {
            windParticles.push(new Wind(random(width), random(height)));
        }
        
    }

    //draw wind
    for (let i = 0; i < windParticles.length; i++) {
        let p = windParticles[i];
        if (!p.drawAndMove()) {
            windParticles.splice(i, 1);
            i--;
        }
    }

    if (!windPressed) {
        windBar += 0.5;
    }

    windBar = constrain(windBar, 0, 120);

    fill(50);
    rect(0, height, width*2, 40);

    fill(240, 240, 255, 150);                    
    rect(0, height, windBar*10, 40);

    // Important! Update the physics engine on each frame, otherwise the world will appear frozen
    Matter.Engine.update(engine);


}


//make smoke particles
class Smoke {
    constructor(x, y) {
        this.x = x + random(-10, 10);
        this.y = y;
        this.size = random(10, 25);
        this.alpha = 200;
        this.c = random(150, 255);
    }

    drawAndmove() {
        this.y += 2;
        this.alpha -= 5;

        fill(this.c, this.alpha);
        circle(this.x, this.y, this.size);

        if (this.alpha <= 0) {
            return false;
        } else {
            return true;
        }
    }
}

//make money particles 
class Money{
    constructor(x, y, value) {
        this.x = x;
        this.y = y;
        this.size = billSizes[value]/2.5;
        this.alpha = 300;
    }

    drawAndMove() {
        this.y -= 1;
        this.alpha -= 5;

        textSize(this.size);
        fill(50, 250, 50, this.alpha);
        text("$", this.x, this.y);

        if (this.alpha <= 0) {
            return false;
        } else {
            return true;
        }
    }
}

//wind
class Wind{
    constructor(x, y) { 
        this.x = x;
        this.y = y;
        this.size = random(20, 40);
        this.alpha = random(150,200);
        this.speed = random(4, 8);
    }

    drawAndMove() {
        this.y -= this.speed;
        this.alpha -= 5;

        fill(255, this.alpha);
        rect(this.x, this.y, 1, this.size);

        if (this.alpha <= 0) {
            return false;
        } else {
            return true;
        }
    }
}

function handleCollisionStart(event) {

    for (let pair of event.pairs){
        let bodyA = pair.bodyA;
        let bodyB = pair.bodyB;


        // //ramp
        // else if (bodyA.customInfo.type === "obj" && bodyB.customInfo.type === "ramp") {
        //     //bounce off
        //     bodyA.velocity.x *= -1.5;
        //     bodyA.velocity.y *= -1.2;

        //     Matter.Body.setVelocity(bodyA, { x: bodyA.velocity.x, y: bodyA.velocity.y });
        // }

        let obj = null;
        let cup = null;

        if (bodyA.customInfo.type === "obj" && bodyB.customInfo.type === "cup") {
            obj = bodyA;
            cup = bodyB;
        } else if (bodyB.customInfo.type === "obj" && bodyA.customInfo.type === "cup") {
            obj = bodyB;
            cup = bodyA;
        }

        if (obj && cup) {
            obj.customInfo.collected = true;
            obj.customInfo.cupEnterTime = millis();
            
        }
          
    }

} 



//if not touching anymore, cant be counted
function handleCollisionEnd(event) {
    for (let pair of event.pairs) {
        let bodyA = pair.bodyA;
        let bodyB = pair.bodyB;

        let obj = null;
        let cup = null;

        if (bodyA.customInfo.type == "obj" && bodyB.customInfo.type == "cup") {
            obj = bodyA;
            cup = bodyB;
        } else if (bodyB.customInfo.type == "obj" && bodyA.customInfo.type == "cup") {
            obj = bodyB;
            cup = bodyA;
        }

        //check if in contact with cup
        if (obj && cup) {

            let d  = dist(obj.position.x, obj.position.y, cup.position.x, cup.position.y);
            if (d > 50) {
                obj.customInfo.collected = false;
            }
        }

        
    }
}



function keyPressed() {
    //ramp1  w
    if ((key == 'w' || key == 'W') && ramp1State == "none") {
        //console.log(ramp1State);
        ramp1State = "up";
        //console.log(ramp1State);

    }
    
    //ramp2  q
    if ((key == 'q' || key == 'Q') && ramp2State == "none") {
        ramp2State = "up";

    }
}

