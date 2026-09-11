// variable to hold a reference to our A-Frame world
let world;


let keys = [];

let bufferHUD;
let buffer1, buffer2;
let texture1, texture2;

function setup() {
    // no canvas needed
    noCanvas();

    // construct the A-Frame world
    // this function requires a reference to the ID of the 'a-scene' tag in our HTML document
    world = new AFrameP5.World('VRScene');

    // let b = new AFrameP5.Box({
    //     red: 255, green: 0, blue: 0,
    //     z: -5
    // });

    // world.add(b);

    //floor
    let floor = new AFrameP5.Box({
        //red: 100, green: 100, blue: 100,
        green: 175, red: 45, blue: 34,
        width: 100, height: .1, depth: 100,
        asset: 'cartoonGrass',
        repeatX:40, repeatY: 40,
        y: -.5
    });
    world.add(floor);

    //sky
    let sky = new AFrameP5.Sky({
        asset: 'sky'
    });
    world.add(sky);



    //floating island
    //decided to do a bunch of cylinders to simluate floating rock island
    let ih = 3;
    let island1 = new AFrameP5.Cylinder({
        red: 139, green: 69, blue: 19,
        radius: 10, height: 2,
        y: 15+ih, z: -15, x: 10
    });
    let islandGrass = new AFrameP5.Cylinder({
        asset: 'cartoonGrass',
        repeatX:1, repeatY:1,
        green: 175, red: 45, blue: 34,
        radius: 10.2, height: .5,
        y: 16 + ih, z: -15, x: 10
    });
    let island2 = new AFrameP5.Cylinder({
        red: 90, green: 45, blue: 4,
        radius: 8, height: 2,
        y: 13 + ih, z: -15, x: 10
    });
    let island3 = new AFrameP5.Cylinder({
        red: 80, green: 80, blue: 80,
        radius: 6, height: 2,
        y: 11 + ih, z: -15, x: 10
    });
    world.add(island1);
    world.add(island2);
    world.add(island3);
    world.add(islandGrass);


    //house
    //key inside so player cna enter by clicking door
    let houseWall1 = new AFrameP5.Box({
        red: 255, green: 228, blue: 181,
        width: 4, height: 4, depth: .5,
        y: 1.9, z: -17, x: -10
    });
    let houseWall2 = new AFrameP5.Box({
        red: 255, green: 228, blue: 181,
        width: .5, height: 4, depth: 4,
        y: 1.9, z: -15, x: -12
    });
    let houseWall3 = new AFrameP5.Box({
        red: 255, green: 228, blue: 181,
        width: .5, height: 4, depth: 4,
        y: 1.9, z: -15, x: -8
    });
    let houseWall4 = new AFrameP5.Box({
        red: 255, green: 228, blue: 181,
        width: 4, height: 4, depth: .5,
        y: 1.9, z: -13, x: -10
    });
    let houseDoor = new AFrameP5.Box({
        red: 139, green: 69, blue: 19,
        width: 1.4, height: 2.5, depth: .8,
        y: 1.1, z: -13, x: -10
    });
    
    let houseRoof = new AFrameP5.Cone({
        red: 178, green: 34, blue: 34,
        radiusTop: 1, radiusBottom: 4, height: 2,
        y: 4.5, z: -15, x: -10
    });

    let houseFloor = new AFrameP5.Box({
        red: 160, green: 82, blue: 45,
        width:6, height: .3, depth: 6,
        y: -.3, z: -15, x: -10
    });

    world.add(houseFloor);
    world.add(houseRoof);
    world.add(houseWall1);
    world.add(houseWall2);
    world.add(houseWall3);
    world.add(houseWall4);
    world.add(houseDoor);


    //higher house floor for tp
    let tp2 = new AFrameP5.Box({
        red: 160, green: 82, blue: 45,
        width: 6, height: .3, depth: 6,
        y: 2, z: -15, x: -10
    });
    //same for the island
    let tp1 = new AFrameP5.Cylinder({
        repeatX: 1, repeatY: 1,
        green: 175, red: 45, blue: 34,
        radius: 10.2, height: .5,
        y: 16 + ih + 2, z: -17, x: 12
    });


    //dynamic texture
    buffer1 = createGraphics(256, 256);
    buffer2 = createGraphics(256, 256);

    buffer1.background(255);
    buffer2.background(255);

    texture1 = world.createDynamicTextureFromCreateGraphics(buffer1);
    texture2 = world.createDynamicTextureFromCreateGraphics(buffer2);

    let tv = new AFrameP5.Box({
        width: 2, height: 1, depth: .1,
        x: -10, y: 1.5, z: -16.4,
        asset: texture1,
        dynamicTexture: true,
        dynamicTextureWidth: 256,
        dynamicTextureHeight: 256
    });
    let tvBack = new AFrameP5.Box({
        red: 0, green: 0, blue: 0,
        width: 2.2, height: 1.2, depth: .1,
        x: -10, y: 1.5, z: -16.41
    });
    world.add(tvBack);
    world.add(tv);

    for (let i = 0; i < 3; i++) {
        movingText.push(new tvBouncingText(random(0, 200), random(0, 200)));
    }


    //sign with instructions
    signContainer = new AFrameP5.Container3D({ x: 0,y: 0, z: 0});
    world.add(signContainer);

    // post is child of container
    let signPost = new AFrameP5.Cylinder({
        red: 139, green: 69, blue: 19,
        radius: 0.1,
        height: 1.5,
        x: 0,
        y: 0.75,
        z: 0
    });

    let sign = new AFrameP5.Box({
        width: 2, height: 1.1,
        depth: 0.1,
        x: 0,
        y: 1.3, 
        z: .1,
        asset: texture2,
        dynamicTexture: true,
        dynamicTextureWidth: 256,
        dynamicTextureHeight: 256
    });

    //children
    signContainer.addChild(signPost);
    signContainer.addChild(sign);


    


    //button panel that tp player to floating island
    let buttonPanel1 = new AFrameP5.Box({
        red: 0, green: 0, blue: 0,
        width: 1.5, height: 1.5, depth: .5,
        x: -10, y: 0.5, z: -17.4
    });
    let buttonToIsland = new AFrameP5.Cylinder({
        red: 255, green: 0, blue: 0,
        radius: .3, height: .5,
        x: -10, y: .6, z: -17.6,
        clickFunction: function () {
            world.teleportToObject(tp1);
        }
    });
    buttonToIsland.spinX(90);
    world.add(buttonToIsland);
    world.add(buttonPanel1);

    //button panel to go back down from island
    let buttonPanel2 = new AFrameP5.Box({
        red: 0, green: 0, blue: 0,
        width: 1.5, height: 1.5, depth: .5,
        x: 10, y: 20.2, z: -15
    });
    let buttonToGround = new AFrameP5.Cylinder({
        red: 0, green: 255, blue: 0,
        radius: .3, height: .8,
        x: 10, y: 20.3, z: -15,
        clickFunction: function () {
            world.teleportToObject(tp2);
        }
    });
    buttonToGround.spinX(90);
    world.add(buttonToGround);
    world.add(buttonPanel2);



    //box
    box = new AFrameP5.GLTF({
        asset: 'box',
        scaleX: 15, scaleY: 10, scaleZ: 15,
        y: 2.6, z: -5, x: 10,
        clickFunction: function () {
            boxLift = true;
        }
    });
    world.add(box);
    box.spinX(180);
    box.spinY(15);


    //keys to find
    let key1 = new AFrameP5.GLTF({
        asset: 'key',
        scaleX: 1.7, scaleY: 1.7, scaleZ: 1.7,
        // x:10, y:2.6, z:-5)
        x: 8, y: 1, z: -5.5,
        clickFunction: function () {
            key1.hide();
            keysFound++;
        }
    });
    let key2 = new AFrameP5.GLTF({
        asset: 'key',
        scaleX: 1.5, scaleY: 1.5, scaleZ: 1.5,
        x: -10, y: 0.8, z: -15.6,
        clickFunction: function () {
            key2.hide();
            keysFound++;
        }
    });
    let key3 = new AFrameP5.GLTF({
        asset: 'key',
        scaleX: 2, scaleY: 2, scaleZ: 2,
        x: 10, y: 21.5, z: -15,
        clickFunction: function () {
            key3.hide();
            keysFound++;
        }
    });

    keys.push(key1);
    keys.push(key2);
    keys.push(key3);

    for (let i = 0; i < keys.length; i++) {
        world.add(keys[i]);
        keys[i].spinZ(90);
    }


    //HUD
    bufferHUD = createGraphics(256, 64);
    bufferHUD.background(255);
    let bufferTextureHUD = world.createDynamicTextureFromCreateGraphics(bufferHUD);

    let hudPlane = new AFrameP5.Plane({
        width: 1.5, height: .375,
        x: 1, y: 1.3, z: -2,
        asset: bufferTextureHUD,
        dynamicTexture: true,
        dynamicTextureWidth: 256,
        dynamicTextureHeight: 64,
        
    });
    world.addToHUD(hudPlane);

    world.setFlying(false);


}

let insX = 50, insY = 50;
let insSX = 2, insSY = 2.5;

let keyY = 0;
let keySY = .01;

let movingText = [];

let keysFound = 0;

let boxLift = false;

let box;


let particles = [];
let win = false;
let winEffect = false;

let signContainer;
let signOffset = 0;
let signDir = 0.02;

function draw() {

    //animate
    for (let i = 0; i < keys.length; i++) {
        keys[i].spinY(1);
        keys[i].nudge(0, keySY, 0);
        keyY += keySY;
    }

    if (keyY > 1 || keyY < -1) {
        keySY *= -1;
    }

    //draw on tv screen

    //tv static/ text in the backgorund
    for (let i = 0; i < movingText.length; i++) {
        movingText[i].drawAndMove(buffer1);
    }


    buffer1.fill(0);
    buffer1.textSize(19);
    buffer1.textAlign(CENTER, CENTER);
    buffer1.text("The Way to the Floating Island", 128, 128);
    buffer1.text("Is behind this house", 128, 160);


    //draw on sign explaining the game
    buffer2.background(166, 116, 73);
    buffer2.textSize(18);
    buffer2.fill(255);
    buffer2.textAlign(CENTER,CENTER);
    buffer2.text("Find the", insX, insY);
    buffer2.text(" 3 keys ", insX, insY+18);
    buffer2.text("to win the Game!", insX, insY+36);

    insX += insSX;
    insY += insSY;
    if (insX > 226 || insX < 30) {
        insSX *= -1;
    }
    if (insY > 226 || insY < 30) {
        insSY *= -1; 
    }

    //move sign
    signOffset += signDir;
    if (signOffset > 2 || signOffset < -2) {
        signDir *= -1;
    }
    signContainer.setX(signOffset);

    //box lift when clicked
    if (boxLift) {
        boxLift = false;
        box.nudge(0, .2, 0);
    }

    if (winEffect) {
        let temp = new Particle( random(-20, 20), 25, random(-20, 20));
        particles.push(temp);

        for (let i = 0; i < particles.length; i++) {
            if (!particles[i].move()) {
                particles.splice(i, 1);
                i --;
            }
        }
    }


    //HUD
    bufferHUD.background(255);
    bufferHUD.fill(0);
    bufferHUD.textSize(15);
    bufferHUD.textAlign(LEFT, CENTER);
    bufferHUD.text("Keys Found: " + keysFound + " / 3", 10, 32);
    
    if (keysFound >= 3 && !win) {
        bufferHUD.fill(0, 200, 0);
        bufferHUD.textSize(20);
        bufferHUD.textAlign(CENTER, CENTER);
        bufferHUD.text("You Found All The Keys! You Win!", 128, 32);
        win = true;

        winEffect = true;
    }
}

class Particle {
    constructor(x, y, z) {
        this.myBox = new AFrameP5.Box({
            x: x,
            y: y,
            z: z,
            red: random(255),
            green: random(255),
            blue: random(255),
            width: 0.7,
            height: 0.7,
            depth: 0.7
        });

        world.add(this.myBox);

        this.yVel = -0.08;

        this.spinX = random(-2, 2);
        this.spinY = random(-2, 2);
    }

    move() {
        this.myBox.nudge(0, this.yVel, 0);
        this.myBox.spinX(this.spinX);
        this.myBox.spinY(this.spinY);

        //use the get position so the particles can be deleted
        let pos = this.myBox.getPosition();
        if (pos.y < 0) {
            world.remove(this.myBox);
            return false;
        } else {
            return true;
        }
    }
}


class tvBouncingText{
    constructor(x, y){
        this.x = x;
        this.y = y;
        this.insX = x;
        this.insY = y;
        this.insSX = random(1,3);
        this.insSY = random(1,3);
        this.r = random(255)+100;
        this.g = random(255)+100;
        this.b = random(255)+100;
    }
    drawAndMove(buffer){
        buffer.fill(this.r, this.g, this.b);
        //buffer.fill(random(255), random(255), random(255));
        buffer.textSize(10);
        buffer.textAlign(CENTER, CENTER);
        buffer.text("Cool House Right?", this.insX, this.insY);

        this.insX += this.insSX;
        this.insY += this.insSY;
        if (this.insX > 260 || this.insX < -20) {
            this.insSX *= -1;
        }
        if (this.insY > 256 || this.insY < -2) {
            this.insSY *= -1; 
        }
    }
}
