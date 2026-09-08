let gameState = "earth";
let earthState = "earthCutscene";
const w = window.innerWidth-1, h = window.innerHeight-4;

willReadFrequently = true;

let levelHitMap;

let charState = {
  face_color: "#af8746ff",
  hat_color: "#cb1d1dff",
  pant_color:"#37447bff"
};

let pixelFont;
let char_hat, char_face, char_pant;
let char_hat_left, char_face_left, char_pant_left;
let char_hat_right, char_face_right, char_pant_right;
let char_hat_top;

//player
let player;

//Matter
let Engine = Matter.Engine;
let World = Matter.World;
let Bodies = Matter.Bodies;

let engine, world;
let walls = {};
let boxes = [];

let gravDir = { x: 0, y: 0 };
const worldGrav = 2; 

let ALLDIALOGUES = {};

let grassBackground, bulletImg, swordImg, bossImg, pathGrassBackground, houseImg, tree, gearImg;
let rockImg, topHatImg, dirt, minerImg, scoutImg, bossFaceImg, signImg, heartImg, chestOpenImg, chestClosedImg, portalGif;
let bulletSound, portalOpenSound, gameOverSound, musicLoop, questCompletedSound;
let startDialogueSound;
let playerHitSound, bossHitSound, openChestSound;

let corner, side, down, tile;
let snobImgs = [];
function preload() {
  //character sprites
  char_hat = loadImage("globalImages/character/char_hat.png");
  char_face = loadImage("globalImages/character/char_face.png");
  char_pant = loadImage("globalImages/character/char_pant.png");

  char_hat_left = loadImage("globalImages/character/char_hat_left.png");
  char_face_left = loadImage("globalImages/character/char_face_left.png");
  char_pant_left = loadImage("globalImages/character/char_pant_left.png");

  char_hat_right = loadImage("globalImages/character/char_hat_right.png");
  char_face_right = loadImage("globalImages/character/char_face_right.png");
  char_pant_right = loadImage("globalImages/character/char_pant_right.png");

  char_hat_top = loadImage("globalImages/character/char_hat_top.png");

  pixelFont = loadFont("media/pixelify_sans/pixelifysans-variablefont_wght.ttf");

  rockyImg = loadImage("globalImages/character/char_hat_top.png");

  grassBackground = loadImage("media/images/background.png");

  bulletImg = loadImage("media/images/bullet.png");
  swordImg = loadImage("media/images/sword.png");

  tree = loadImage("media/images/tree1.png");

  bossImg = loadImage("media/images/boss.png");
  pathGrassBackground = loadImage("media/images/pathGrass.png");

  houseImg = loadImage("media/images/house.png");

  let custom_char = JSON.parse(localStorage.getItem("custom_char"));

  gearImg = loadImage("media/images/gear1.png");

  topHatImg = loadImage("media/images/topHat.png");

  snobImgs.push(loadImage("media/images/snob1.png"));
  snobImgs.push(loadImage("media/images/snob2.png"));
  snobImgs.push(loadImage("media/images/snob3.png"));
  snobImgs.push(loadImage("media/images/snob4.png"));

  rockImg = loadImage("media/images/rock.png");

  dirt = loadImage("media/images/dirt.png");

  minerImg = loadImage("media/images/miner.png");

  scoutImg = loadImage("media/images/scout.png");

  bossFaceImg = loadImage("media/images/bossImg.png");

  corner = loadImage("media/images/corner.png");
  down = loadImage("media/images/down.png");
  side = loadImage("media/images/side.png");

  tile = loadImage("media/images/tile.png");

  signImg = loadImage("media/images/sign.png");

  heartImg = loadImage("media/images/heart.png");

  chestOpenImg = loadImage("media/images/chestOpen.png");
  chestClosedImg = loadImage("media/images/chestClosed.png");
  portalGif = loadImage("media/images/portal.gif");

  bulletSound = loadSound("media/sounds/shoot.wav");
  portalOpenSound = loadSound("media/sounds/portalopen.mp3");
  gameOverSound = loadSound("media/sounds/gameOver.mp3");
  musicLoop = loadSound("media/sounds/prancingAbout.wav");
  questCompletedSound = loadSound("media/sounds/jingle.wav");

  startDialogueSound = loadSound("media/sounds/select.wav");


  //get sounds: getting hit, player and boss, openchest, 
  playerHitSound = loadSound("media/sounds/playerHit.mp3");
  bossHitSound = loadSound("media/sounds/bossHit.mp3");

  openChestSound = loadSound("media/sounds/openChest.mp3");

  arrowImg = loadImage("media/images/arrow.png");
  


  ALLDIALOGUES = {
    quest1Intro: {
      name: "Crowd of Distinguished Homeowners",
      image: snobImgs[0],
      lines: [
        "Oh. You can walk. How refreshing.",
        "Yes, yes, we know what we look like. Very ironic.",
        "Gravity stopped cooperating with us, and frankly, we are above crawling.",
        "Those holographic houses behind you? Ours.",
        "You can pass straight through them. Very expensive feature\n But you wouldn't know anything about that.",
        "We just bought color-coded hats to match our homes. Charming, no?",
        "If you somehow cannot tell where we belong, you may speak to us individually.",
        "Gravity still listens to you ..for some reason... \nSo kindly push us home.",
        "Do not scuff the holograms, they were expensive."
      ]
    },

    quest1Solved: {
      name: "Crowd of Distinguished Homeowners",
      image: snobImgs[1],
      lines: [
        "Well. That worked better than expected.",
        "Now that we think about it, holographic real estate is quite practical.",
        "As promised, take this Earth Key.",
        "Try not to lose it. We would hateeee to explain this again.",
        "Jesting, there really isn't anything else to do around here."
      ]
    },

    quest2Intro: {
      name: "Scout Miner Leader",
      image: scoutImg,
      lines: [
        "Yo. Heads up. Gravity is doing that thing again.",
        "My junior scouts were mapping the cave when it flipped again.",
        "They are small. They panic easy. So be gentle please? ",
        "Use your gravity shifts to guide them into the cave.",
        "Arrow keys. Up, down, left, right. You got this.",
        "Once a scout reaches the cave entrance, they are safe.",
        "Get them all out and the second key is yours."
      ]
    },

    quest2Solved: {
      name: "Scout Miner Leader",
      image: scoutImg,
      lines: [
        "Nice. All accounted for.",
        "Cave walls cancel out the storm surges.",
        "Kids are shaken, but alive. That matters.",
        "Here. An Earth Key."
      ]
    },

    quest3Intro: {
      name: "Earth Guardian",
      image: bossFaceImg,
      lines: [
        "So... another one is sent.",
        "You carry gravity like a leash, not a blessing.",
        "This chamber was sealed to keep my kind contained.",
        "Yet here you stand, pulling the world sideways.",
        "That sword answers to force, not courage.",
        "If you want the final key, prove you are worthy."
      ]
    },

    quest3Solved: {
      name: "Fading Earth Guardian",
      image: bossFaceImg,
      lines: [
        "Hah. Still fighting the pull, even now.",
        "Listen carefully, gravity-bearer.",
        "Take the Earth Key.",
        "But know your power will not always be there to help you."
      ]
    },

    earthWorldSolved: {
      name: "Crowd",
      image: "player",
      lines: [
        "The ground feels quieter now.",
        "Some of us may become people again.",
        "Some may remain furniture. Time will tell.",
        "Earth is stabilizing, but the source lies elsewhere.",
        "Other worlds are breaking the same way.",
        "Go. Do not trust the hand that gave you gravity."
      ]
    },

    mainroomNorthSign: {
      name: "Sign",
      image: signImg,
      lines: [
        "NORTH: Dungeon of the Earth Guardian.",
        "Beware the bullets."
      ]
    },

    mainroomWestSign: {
      name: "Sign",
      image: signImg,
      lines: [
        "WEST: Aventure Caves.",
        "Don't get lost in the dark maze this cave is!"
      ]
    },

    mainroomEastSign: {
      name: "Sign",
      image: signImg,
      lines: [
        "EAST: The (Snobs) Distinguished Homeowners District.",
        "Stop vandalizing our sign!!"
      ]
    },
    mainroomChestLocked: {
      name: "Chest",
      image: chestClosedImg,
      lines: [
        "It won't budge.", "Three keys. Then we talk."
      ]
    },
    mainroomChestOpen: {
      name: "Chest",
      image: chestOpenImg,
      lines: ["The locks gives way.", 
        "A portal wakes up behind it.",
        "You hear the sound of wind through the portal"
      ]
    },
    earthCutsceneIntro: {
      name: "You",
      image: "player",
      lines: [
        "…Ow. My head.",
        "I crashed. Into a world that feels like dirt and rocks.",
        "Not my finest landing but... at least I'm whole.",
        "*You hear a voice approaching*",
        "...",
      ]
    },
    earthCutsceneVoice: {
      name: "Voice",
      image: "player",
      lines: [
        "...",
        "...Welcome, traveler.",
        "You fell into the Earth World.",
        "Take this Earth Coin.",
        "It binds to you. That is why gravity listens now.",
        "Move with W A S D.",
        "Shift our world's gravity with the arrow keys. \n And stop it with with the R key",
        "Help this world. You are the only one who can.",
        "Get the three Earth keys from North, West, and East.\nThen return here to open the chest.",
        "Only you can save us now.",
        "Good luck."
      ]
    },

  };
  


  if (custom_char) {
    charState = custom_char;
  }

 


}


function setup() {
  createCanvas(w, h, { willReadFrequently: true });
  noSmooth();
  rectMode(CENTER);
  imageMode(CENTER);


  engine = Engine.create();
  world = engine.world;

  Matter.Events.on(engine, "collisionStart", handleCollisionStart);

  player = new Player(width / 2, height / 2);

  world.gravity.x = 0;
  world.gravity.y = 0;
  musicLoop.loop();

}

function draw() {
  background(18, 26, 34);
  Engine.update(engine);

  if (gameState === "earth") {
    drawEarth();
  }

}

/* ==================== Earth state drawing loop ==================== */

function drawEarth() {
  if (earthState === "earthCutscene") {
    drawEarthCutscene();
  }
  else if (earthState === "earthMainroom") {
    drawEarthMainroom();
  }
  else if (earthState === "earthQuest1") {
    drawEarthQuest1();
  } 
  else if (earthState === "earthQuest2") {
    drawEarthQuest2();
  } 
  else if (earthState === "earthQuest3") {
    drawEarthQuest3();
  }
}

/* ==================== Earth Cutscene ==================== */

let stage = 0; 

function drawEarthCutscene() {
  background(0);

  if (stage === 0) {
    startDialogue(ALLDIALOGUES.earthCutsceneSelf);
    stage = 1;
  }

  if (stage === 1 && !dialogueState.active) {
    startDialogue(ALLDIALOGUES.earthCutsceneVoice);
    stage = 2;
  }

  if (stage === 2 && !dialogueState.active) {
    earthState = "earthMainroom";
    objectsPlacedMainroom = false;
    stage = 3;
    return;
  }

  drawDialogue();
}


/* ==================== Earth mainroom ==================== */



let objectsPlacedMainroom = false;

let mainroomEnterX = w/2;
let mainroomEnterY = h/2;

let door1 = {x: w, y: h/2, w: 40, h: 60, unlocked: true}; //right
let door2 = { x: 0, y: h / 2, w: 40, h: 40, unlocked: true }; //left
let door3 = { x: w / 2, y: 0, w: 60, h: 40, unlocked: true }; //top

const Y = (pxY) => h * (pxY / 900);
const X = (px) => w * (px / 1600);

const thick= X(150);

function drawMainroomBorderTreesTop() {
  const treeW = X(140);
  const treeH = Y(180);

  const peek = constrain(treeW * 0.45, Y(40), Y(120));

  const stepX = constrain(w / 10, X(70), X(170));
  const stepY = constrain(h / 7, Y(80), Y(200));

  // top
  for (let x = 0; x <= w; x += stepX) {
    if (x > door3.x - treeW/2 && x < door3.x  + treeW/2) continue;
    image(tree, x, -peek + treeH / 2, treeW, treeH);
  }

  // left
  for (let y = 0; y <= h; y += stepY) {
    if (y > door2.y  - treeH/2 ) continue;
    image(tree, -peek + treeW / 2, y + 70, treeW, treeH);
  }

  // right
  for (let y = 0; y <= h; y += stepY) {
    if (y > door2.y - treeH / 2) continue;
    image(tree, w + peek - treeW / 2, y+70, treeW, treeH);
  }
}

function drawMainroomBorderTreesBottom() {
  
  const treeW = X(140);
  const treeH = Y(180);

  const peek = constrain(treeW * 0.45, Y(40), Y(120));

  const stepX = constrain(w/10, X(70), X(170));
  const stepY = constrain(h/7 * 0.5, Y(80), Y(200));


  // bottom
  for (let x = 0; x <= w; x += stepX) {
    image(tree, x, h + peek - treeH / 2, treeW, treeH);
  }

  // left
  for (let y = 0; y <= h; y += stepY) {
    if (y < door2.y + treeH / 2) continue;
    image(tree, -peek + treeW / 2, y, treeW, treeH);
  }

  // right
  for (let y = 0; y <= h; y += stepY) {
    if ( y < door2.y + treeH / 2) continue;
    image(tree, w + peek - treeW / 2, y, treeW, treeH);
  }

  // bottom
  for (let x = 0; x <= w; x += stepX) {
    image(tree, x, h + peek - treeH / 2, treeW, treeH);
  }
}

function drawMainroomEntranceSigns() {


  const signW = X(80);
  const signH = Y(80);

  const signs = [
    { x: 0, y: h / 2 , imgX: X(60), imgY: h / 2 - Y(70), dialogue: ALLDIALOGUES.mainroomWestSign },
    { x: w, y: h / 2, imgX: w - X(60), imgY: h / 2 - Y(70), dialogue: ALLDIALOGUES.mainroomEastSign },
    { x: w / 2, y: 0, imgX: w / 2 - X(90), imgY: Y(70), dialogue: ALLDIALOGUES.mainroomNorthSign }
  ];

  for (let s of signs) {
    image(signImg, s.imgX, s.imgY, signW, signH);

    const d = dist(player.body.position.x, player.body.position.y, s.x, s.y);
    if (d < 250 && !dialogueState.active) {
      fill(255);
      textAlign(CENTER, TOP);
      textSize(18);
      stroke(0);
      strokeWeight(5);

      text("Press E to read", s.imgX, s.imgY - signH / 2 - 10);

      if (keyIsDown(69)) startDialogue(s.dialogue);
    }
  }
}


//chest
let chestBody = null;
let chestOpened = false;
let portalActive = false;


function drawAndHandleMainroomChest() {
  if (!chestBody) return;

  const cx = chestBody.position.x;
  const cy = chestBody.position.y;

  // draw chest
  push();
  imageMode(CENTER);
  const img = chestOpened ? chestOpenImg : chestClosedImg;
  image(img, cx, cy, chestBody.customInfo.width, chestBody.customInfo.height);
  pop();

  const px = player.x + player.size / 2;
  const py = player.y + player.size / 2;
  const nearChest = dist(px, py, cx, cy) < 200;

  //hint
  if (nearChest && !dialogueState.active && !chestOpened) {
    if (pixelFont) textFont(pixelFont);
    push();
    fill(255);
    textAlign(CENTER, BOTTOM);
    stroke(0);
    strokeWeight(5);
    textSize(20);
    text("Press E", cx, cy - chestBody.customInfo.height+20);
    pop();
  }

  //interact chest
  if (nearChest && keyIsDown(69)) {
    if (!chestOpened) {
      const hasAllKeys = earthKey1Obtained && earthKey2Obtained && earthKey3Obtained;
      if (hasAllKeys) {
        chestOpened = true;
        portalActive = true;
        portalOpenSound.play();
        openChestSound.play();
        startDialogue(ALLDIALOGUES.mainroomChestOpen);
      } else {
        startDialogue(ALLDIALOGUES.mainroomChestLocked);
      }
    }
  }

  //portal
  if (portalActive) {
    const portalX = cx;
    const portalY = cy - Y(110);

    push();
    imageMode(CENTER);
    image(portalGif, portalX, portalY, X(170), Y(170));
    pop();

    const nearPortal = dist(px, py, portalX, portalY) < 200;

    if (nearPortal && !dialogueState.active) {
      if (pixelFont) textFont(pixelFont);
      push();
      fill(255);
      textAlign(CENTER, BOTTOM);
      stroke(0);
      strokeWeight(5);
      textSize(20);
      text("Press E", portalX, portalY - Y(90));
      pop();
    }

    if (nearPortal && keyIsDown(69) && !dialogueState.active) {
      // TODO: go through portal
      window.location.href = '../karenMidterm/index.html';
    }
  }
}



function drawEarthMainroom() {

  //draw background
  image(grassBackground, w / 2, h / 2, w, h);

  drawMainroomBorderTreesTop();

  if (!objectsPlacedMainroom) {
    makeWallsAndObjectsMainroom();
    objectsPlacedMainroom = true;
  }

  drawMainroomEntranceSigns();


  //apply gravity to boxes
  for (let b of boxes) {
    Matter.Body.applyForce(b, b.position, {
      x: gravDir.x * worldGrav,
      y: gravDir.y * worldGrav
    });
  }

  //draw Matter walls
  fill(250,200,255);
  noStroke();
  // drawBodyRect(walls.bottom);

  // drawBodyRect(walls.top1);
  // drawBodyRect(walls.top2);

  // drawBodyRect(walls.left1);
  // drawBodyRect(walls.left2);

  // drawBodyRect(walls.right1);
  // drawBodyRect(walls.right2);

  //draw boxes for test
  fill(120, 180, 220);
  noStroke();
  for (let i = 0; i < boxes.length; i++) {
    drawBodyRect(boxes[i]);
  }

  //player movement
  player.move();
  player.display();

  drawMainroomBorderTreesBottom();


  //go into room1 (right)
  if (playerAABB().x + playerAABB().w > door1.x + 20 &&playerAABB().y + playerAABB().h > door1.y - door1.h/2 && door1.unlocked) {

    earthState = "earthQuest1";
    World.clear(world);
    boxes = [];
    walls = {};
    objectsPlacedMainroom = false;
    quest1ObjectsPlaced = false;
    return;
  }

  // go into room2 (left)
  if (playerAABB().x < door2.x + 20 && playerAABB().y + playerAABB().h > door2.y - door2.h / 2 && playerAABB().y < door2.y + door2.h / 2 && door2.unlocked) {
    earthState = "earthQuest2";
    World.clear(world);
    boxes = [];
    walls = {};
    objectsPlacedMainroom = false;
    quest2ObjectsPlaced = false;
    return;
  }

  // go into room3 (top)
  if (playerAABB().y < door3.y - 20 && playerAABB().x + playerAABB().w > door3.x - door3.w / 2 &&playerAABB().x < door3.x + door3.w / 2 && door3.unlocked) {

    earthState = "earthQuest3";
    World.clear(world);
    boxes = [];
    walls = {};
    objectsPlacedMainroom = false;
    quest3ObjectsPlaced = false;
    return;
  }

  
  drawAndHandleMainroomChest() 


  drawHUD();
  drawDialogue();


}

function makeWallsAndObjectsMainroom(){
  //rest play body to the door they came form
  player.resetBody(mainroomEnterX || 50, mainroomEnterY || h/2);

  //chest
  const cw = X(150);
  const ch = Y(120);

  chestBody = Bodies.rectangle(w/2, h - h/4, cw, ch, {
    isStatic: true,
    customInfo: { type: "chest", width: cw, height: ch }
  });

  World.add(world, chestBody);

  chestOpened = false;
  portalActive = false;
  
  //walls

  walls.bottom = Bodies.rectangle(w / 2, h, w, thick, {
    isStatic: true,
    customInfo: {
      width: w,
      height: thick
    }
  });

  walls.top1 = Bodies.rectangle(0-80, 0, w, thick, {
    isStatic: true,
    customInfo: {
      width: w,
      height: thick
    }
  });
  walls.top2 = Bodies.rectangle(w+80, 0, w, thick, {
    isStatic: true,
    customInfo: {
      width: w,
      height: thick
    }
  });

  walls.left1 = Bodies.rectangle(0, 0-80, thick, h, {
    isStatic: true,
    customInfo: {
      width: thick,
      height: h
    }
  });
  walls.left2 = Bodies.rectangle(0, h+80, thick, h, {
    isStatic: true,
    customInfo: {
      width: thick,
      height: h
    }
  });

  walls.right1 = Bodies.rectangle(w, 0-80, thick, h, {
    isStatic: true,
    customInfo: {
      width: thick,
      height: h
    }
  });
  walls.right2 = Bodies.rectangle(w, h+80, thick, h, {
    isStatic: true,
    customInfo: {
      width: thick,
      height: h
    }
  });

  World.add(world, [walls.bottom, 
     walls.top1, walls.top2,
     walls.left1,walls.left2, 
     walls.right1, walls.right2]);

  //a few random boxes  for the grav test
  // for (let i = 0; i < 6; i++) {
  //   let bx = random(100, w - 100);
  //   let by = random(100, h - 100);
  //   let bw = random(20, 40);
  //   let bh = random(20, 40);
  //   let body = Bodies.rectangle(bx, by, bw, bh, {
  //     friction: 500,
  //     frictionAir: .1,
  //     restitution: 0.3,
  //     density: 1,
  //     customInfo: {
  //       width: bw,
  //       height: bh
  //     }
  //   });
  //   boxes.push(body);
  // }
  // World.add(world, boxes);
}




/* ==================== Earth Quest 1 ==================== */
function drawQuest1BorderTreesTop() {
  const treeW = X(140);
  const treeH = Y(180);

  const peek = constrain(treeW * 0.45, Y(40), Y(120));

  const stepX = constrain(w / 10, X(70), X(170));
  const stepY = constrain(h / 7, Y(80), Y(200));

  // top
  for (let x = 0; x <= w; x += stepX) {
    image(tree, x, -peek + treeH / 2 , treeW, treeH);
  }

  // left
  for (let y = 0; y <= h; y += stepY) {
    if (y > door2.y - treeH / 2 ) continue;
    image(tree, -peek + treeW / 2 , y+70, treeW, treeH);
  }

  // right
  for (let y = 0; y <= h; y += stepY) {
    image(tree, w + peek - treeW / 2, y, treeW, treeH);
  }
}

function drawQuest1BorderTreesBottom() {

  const treeW = X(140);
  const treeH = Y(180);

  const peek = constrain(treeW * 0.45, Y(40), Y(120));

  const stepX = constrain(w / 10, X(70), X(170));
  const stepY = constrain(h / 10 * 0.5, Y(80), Y(200));


  // bottom
  for (let x = 0; x <= w; x += stepX) {
    image(tree, x, h + peek - treeH / 2, treeW, treeH);
  }

  // left
  for (let y = 0; y <= h; y += stepY) {
    if (y < door2.y + treeH / 2) continue;
    image(tree, -peek + treeW / 2, y, treeW, treeH);
  }

  // right
  for (let y = 0; y <= h; y += stepY) {
    image(tree, w + peek - treeW / 2, y, treeW, treeH);
  }

  // bottom
  for (let x = 0; x <= w; x += stepX) {
    image(tree, x, h + peek - treeH / 2, treeW, treeH);
  }
}


let quest1ObjectsPlaced = false;
let quest1IntroShown = false;
let quest1Completed = false;
let earthKey1Obtained = false;

let quest1Houses = [];
let quest1Citizens = [];
let quest1Obstacle = null;
let quest1Obstacle2 = null;
let quest1Obstacle3 = null;

//earthState = "earthQuest1";

let gearAngle = 0;
let gearAngle2 = 0;
function drawEarthQuest1() {
  mainroomEnterX = w - player.size - 10;
  mainroomEnterY = player.y;

  //background
  image(grassBackground, w / 2, h / 2, w, h);

  push();
  rectMode(CORNER);
  fill(0, 0, 30, 80);
  rect(0, 0, w, h);
  pop();

  for (let b of boxes) {
    Matter.Body.applyForce(b, b.position, {
      x: gravDir.x * worldGrav,
      y: gravDir.y * worldGrav
    });
  }

  if (!quest1ObjectsPlaced) {
    makeWallsAndObjectsQuest1();
    quest1ObjectsPlaced = true;
  }

  if (!quest1IntroShown) {
    startDialogue(ALLDIALOGUES.quest1Intro);
    quest1IntroShown = true;
  }

  // walls
  // fill(200, 200, 255);
  // noStroke();
  // drawBodyRect(walls.bottom);
  // drawBodyRect(walls.top);
  // drawBodyRect(walls.left1);
  // drawBodyRect(walls.left2);
  // drawBodyRect(walls.right);

  drawQuest1BorderTreesTop() 

  if (walls.leftGate) {
    //drawBodyRect(walls.leftGate);
    image(rockImg, walls.leftGate.position.x, walls.leftGate.position.y-20, walls.leftGate.customInfo.width+100, walls.leftGate.customInfo.height+150);
  }

  rectMode(CENTER);
  noStroke();
  for (let house of quest1Houses) {

    // //house
    // fill(house.color + "AA");
    // rect(house.x, house.y, house.w, house.h);


    // //roof
    // fill(house.color); 
    // triangle(
    //   house.x - house.w * 1.5 / 2, house.y - house.h / 2, 
    //   house.x + house.w * 1.5 / 2, house.y - house.h / 2, 
    //   house.x, house.y - house.h / 2 - house.h * 0.6 
    // );

    // //door
    // rect(house.x, house.y + house.h / 4, house.w / 4, house.h / 2);

    // fill(0, 50);
    // rect(house.x, house.y + house.h / 4, house.w / 4 - 4, house.h / 2 - 4);

    push();
    tint(house.color+"99");
    image(houseImg, house.x, house.y, house.w, house.h);
    pop();

  }

  if (quest1Obstacle) {
    fill(90, 120, 180);
    noStroke();

    // // core circle
    // push();
    // translate(quest1Obstacle.core.position.x, quest1Obstacle.core.position.y);
    // rotate(quest1Obstacle.core.angle);
    // circle(0, 0, quest1Obstacle.core.customInfo.radius * 2);
    // pop();

    // // bars
    // for (let i = 0; i < quest1Obstacle.bars.length; i++) {
    //   const b = quest1Obstacle.bars[i];
    //   push();
    //   translate(b.position.x, b.position.y);
    //   rotate(b.angle);
    //   rectMode(CENTER);
    //   rect(0, 0, b.customInfo.width, b.customInfo.height);
    //   pop();
    //}

    push();
    //tint(255, 50);
    translate(quest1Obstacle.core.position.x-2, quest1Obstacle.core.position.y);
    rotate(quest1Obstacle.core.angle);
    image(gearImg, 0,0, quest1Obstacle.core.customInfo.radius * 3, quest1Obstacle.core.customInfo.radius * 3);
    pop();

    gearAngle += 0.02;

    Matter.Body.setAngle(quest1Obstacle.core, gearAngle);

    Matter.Body.setAngle(quest1Obstacle.bars[0], gearAngle + 0);
    Matter.Body.setAngle(quest1Obstacle.bars[1], gearAngle + Math.PI / 2);
    Matter.Body.setAngle(quest1Obstacle.bars[2], gearAngle + Math.PI / 4);
    Matter.Body.setAngle(quest1Obstacle.bars[3], gearAngle - Math.PI / 4);
  }
  if (quest1Obstacle2) {
    fill(90, 120, 180);
    noStroke();
    push();
    //tint(255, 50);
    translate(quest1Obstacle2.core.position.x - 2, quest1Obstacle2.core.position.y);
    rotate(quest1Obstacle2.core.angle);
    image(gearImg, 0, 0, quest1Obstacle2.core.customInfo.radius * 3, quest1Obstacle2.core.customInfo.radius * 3);
    pop();

    gearAngle2 += 0.01;

    Matter.Body.setAngle(quest1Obstacle2.core, gearAngle2);

    Matter.Body.setAngle(quest1Obstacle2.bars[0], gearAngle2 + 0);
    Matter.Body.setAngle(quest1Obstacle2.bars[1], gearAngle2 + Math.PI / 2);
    Matter.Body.setAngle(quest1Obstacle2.bars[2], gearAngle2 + Math.PI / 4);
    Matter.Body.setAngle(quest1Obstacle2.bars[3], gearAngle2 - Math.PI / 4);
  }

  if (quest1Obstacle3) {
    fill(90, 120, 180);
    noStroke();
    push();
    //tint(255, 50);
    translate(quest1Obstacle3.core.position.x - 2, quest1Obstacle3.core.position.y);
    rotate(quest1Obstacle3.core.angle);
    image(gearImg, 0, 0, quest1Obstacle3.core.customInfo.radius * 3, quest1Obstacle3.core.customInfo.radius * 3);
    pop();

    gearAngle2 += 0.01;

    Matter.Body.setAngle(quest1Obstacle3.core, gearAngle2);

    Matter.Body.setAngle(quest1Obstacle3.bars[0], gearAngle2 + 0);
    Matter.Body.setAngle(quest1Obstacle3.bars[1], gearAngle2 + Math.PI / 2);
    Matter.Body.setAngle(quest1Obstacle3.bars[2], gearAngle2 + Math.PI / 4);
    Matter.Body.setAngle(quest1Obstacle3.bars[3], gearAngle2 - Math.PI / 4);
  }


  fill(120, 180, 220);
  noStroke();
  for (let b of boxes) {
    if (b.customInfo && b.customInfo.type === "citizen") {
      push();
      fill(255);
      translate(b.position.x, b.position.y);
      rotate(b.angle);
      rectMode(CENTER);
      rect(0, 0, b.customInfo.width, b.customInfo.height);
      image(snobImgs[b.customInfo.houseId % snobImgs.length], 0, 0, b.customInfo.width, b.customInfo.height);
      pop();

      //hat
      const house = quest1Houses[b.customInfo.houseId];
      if (house) {
        const hatW = b.customInfo.width * 1.8;
        const hatH = 6;
        const offsetY = -b.customInfo.height * 0.6;

        fill(house.color);
        // push();
        // translate(b.position.x, b.position.y);
        // rotate(b.angle);
        // rectMode(CENTER);
        // rect(0, offsetY+2, hatW-15, hatH);
        // rect(0, offsetY-16, hatW/3, hatH*5);
        // fill(0,50);
        // rect(0, offsetY - 10, hatW / 3, hatH);

        // pop();

        push();
        translate(b.position.x, b.position.y);
        rotate(b.angle);
        tint(house.color + "FF");
        image(topHatImg, 0, offsetY - 15, hatW, hatH * 10);
        pop();
      }
    } else {
      drawBodyRect(b);
    }
  }

  //tell player to talk to citizens
  if (!dialogueState.active && !quest1Completed) {
    let closest = null;
    let closestD = Infinity;

    const px = player.body.position.x;
    const py = player.body.position.y;

    for (let b of boxes) {
      if (!b.customInfo || b.customInfo.type !== "citizen") continue;

      const d = dist(px, py, b.position.x, b.position.y);
      if (d < closestD) {
        closestD = d;
        closest = b;
      }
    }

    const talkDist = 120;

    if (closest && closestD < talkDist) {
      if (pixelFont) textFont(pixelFont);
      push();
      fill(255);
      textAlign(CENTER, CENTER);
      textSize(15);
      strokeWeight(5);
      stroke(0)
      text("Press E", closest.position.x, closest.position.y - closest.customInfo.height);
      pop();

      if (keyIsDown(69)) {
        startDialogue({
          name: "Snob",
          image: snobImgs[closest.customInfo.houseId % snobImgs.length],
          lines: [closest.customInfo.line]
        });
      }
    }
  }


  player.move();

  player.display();
  

  drawQuest1BorderTreesBottom()

  //TODO add door to prevent leaving until solved

  if (playerAABB().x < 0) {
    if (quest1Completed) {

      earthState = "earthMainroom";
      World.clear(world);
      boxes = [];
      walls = {};
      objectsPlacedMainroom = false;
      quest1ObjectsPlaced = false;
      return;
    } else {
      // show hint near left edge
      if (pixelFont) textFont(pixelFont);
      fill(255);
      textAlign(CENTER, CENTER);
      textSize(12);
      text(
        "I should help everyone \nget home before leaving.",
        player.x+100,
        player.y - 30
      );
    }
  }


  // check win state
  checkQuest1Solved();

  drawHUD();
  drawDialogue();
}

function pointInRect(px, py, rect) {
  return (
    px > rect.x - rect.w / 2 &&
    px < rect.x + rect.w / 2 &&
    py > rect.y - rect.h / 2 &&
    py < rect.y + rect.h / 2
  );
}

function checkQuest1Solved() {
  if (quest1Citizens.length === 0) return;

  let allPlaced = true;

  for (let c of quest1Citizens) {
    const pos = c.position;
    const targetHouse = quest1Houses[c.customInfo.houseId];
    if (!pointInRect(pos.x, pos.y, targetHouse)) {
      allPlaced = false;
      break;
    }
  }


  if (allPlaced && !quest1Completed) {
    questCompletedSound.play();
    quest1Completed = true;
    earthKey1Obtained = true;
    startDialogue(ALLDIALOGUES.quest1Solved);

    if (walls.leftGate) {
      World.remove(world, walls.leftGate);
      walls.leftGate = null;
    }
  }
}



function makeWallsAndObjectsQuest1() {
  player.resetBody(50, h / 2);

  boxes = [];
  quest1Houses = [];
  quest1Citizens = [];

  quest1Obstacle = null;

  // flipped room (ceiling at bottom, floor at top)
  walls.bottom = Bodies.rectangle(w / 2, 0, w, thick, {
    isStatic: true,
    customInfo: { width: w, height: thick }
  });

  walls.top = Bodies.rectangle(w / 2, h, w, thick, {
    isStatic: true,
    customInfo: { width: w, height: thick }
  });

  walls.left1 = Bodies.rectangle(0, 0 - 80, thick, h, {
    isStatic: true,
    customInfo: { width: thick, height: h }
  });
  walls.left2 = Bodies.rectangle(0, h + 80, thick, h, {
    isStatic: true,
    customInfo: { width: thick, height: h }
  });
  walls.right = Bodies.rectangle(w, h / 2, thick, h, {
    isStatic: true,
    customInfo: { width: thick, height: h }
  });

  World.add(world, [walls.bottom, walls.top, walls.left1, walls.left2, walls.right]);

  if (!quest1Completed) {
    const gateHeight = 160;
    walls.leftGate = Bodies.rectangle(0, h / 2, thick, gateHeight, {
      isStatic: true,
      customInfo: { width: thick, height: gateHeight, type: "leftGate" }
    });
  } else {
    walls.leftGate = null;
  }

  if (walls.leftGate) World.add(world, walls.leftGate);

  const houseW = X(230);
  const houseH = X(250);
  const houseY = h * 0.25;


  quest1Houses = [
    { x: w * 0.2, y: houseY, w: houseW, h: houseH, color: "#f28b82" }, 
    { x: w * 0.4, y: houseY, w: houseW, h: houseH, color: "#fbbc04" }, 
    { x: w * 0.6, y: houseY, w: houseW, h: houseH, color: "#34a853" }, 
    { x: w * 0.8, y: houseY, w: houseW, h: houseH, color: "#4285f4" }
  ];

  // citizens snobs
  const citizenCount = quest1Houses.length;
  for (let i = 0; i < citizenCount; i++) {
    // const bx = w * 0.25 + i * 80;
    // const by = h * 0.7;
    const bx = random(w * 0.1, w * 0.9);
    const by = random(h * 0.6, h * 0.9);
    const bw = 50;
    const bh = 50;

    const colors = ['red', 'orange', 'green', 'blue'];

    const body = Bodies.rectangle(bx, by, bw, bh, {
      friction: 20,
      frictionAir: 0.1,
      restitution: 1,
      density: .5,
      customInfo: {
        width: bw,
        height: bh,
        type: "citizen",
        houseId: i,
        line: "Do be careful. I'm from the House #" + (i + 1) +
              " counting from where you came from, the " + colors[i] + " estate.\n" +
              "I expect to be placed back where I belong.",
      }
    });

    boxes.push(body);
    quest1Citizens.push(body);
  }

  World.add(world, boxes);


  // obstacle gear thing
  const ox = w / 2 - X(500);
  const oy = h / 2 + Y(120);

  const coreR = X(90);
  const barL = coreR * 2.7;
  const barT = coreR * 0.5;

  quest1Obstacle = {
    core: Bodies.circle(ox, oy, coreR, {
      isStatic: true,
      customInfo: { type: "q1ObstacleCore", radius: coreR }
    }),
    bars: [
      Bodies.rectangle(ox, oy, barL, barT, {
        isStatic: true,
        angle: 0,
        customInfo: { type: "q1ObstacleBar", width: barL, height: barT }
      }),
      Bodies.rectangle(ox, oy, barL, barT, {
        isStatic: true,
        angle: Math.PI / 2,
        customInfo: { type: "q1ObstacleBar", width: barL, height: barT }
      }),
      Bodies.rectangle(ox, oy, barL, barT, {
        isStatic: true,
        angle: Math.PI / 4,
        customInfo: { type: "q1ObstacleBar", width: barL, height: barT }
      }),
      Bodies.rectangle(ox, oy, barL, barT, {
        isStatic: true,
        angle: -Math.PI / 4,
        customInfo: { type: "q1ObstacleBar", width: barL, height: barT }
      })
    ]
  };

  World.add(world, [quest1Obstacle.core, ...quest1Obstacle.bars]);

  // obstacle gear thing
  const ox3 = w / 2;
  const oy3 = h / 2 + Y(50);

  const coreR3 = X(90);

  quest1Obstacle3 = {
    core: Bodies.circle(ox3, oy3, coreR, {
      isStatic: true,
      customInfo: { type: "q1ObstacleCore", radius: coreR }
    }),
    bars: [
      Bodies.rectangle(ox3, oy3, barL, barT, {
        isStatic: true,
        angle: 0,
        customInfo: { type: "q1ObstacleBar", width: barL, height: barT }
      }),
      Bodies.rectangle(ox3, oy3, barL, barT, {
        isStatic: true,
        angle: Math.PI / 2,
        customInfo: { type: "q1ObstacleBar", width: barL, height: barT }
      }),
      Bodies.rectangle(ox3, oy3, barL, barT, {
        isStatic: true,
        angle: Math.PI / 4,
        customInfo: { type: "q1ObstacleBar", width: barL, height: barT }
      }),
      Bodies.rectangle(ox3, oy3, barL, barT, {
        isStatic: true,
        angle: -Math.PI / 4,
        customInfo: { type: "q1ObstacleBar", width: barL, height: barT }
      })
    ]
  };

  World.add(world, [quest1Obstacle3.core, ...quest1Obstacle3.bars]);

  // obstacle gear thing
  const ox2 = w / 2 + X(500);
  const oy2 = h / 2 + Y(120);

  const coreR2 = X(90);

  quest1Obstacle2 = {
    core: Bodies.circle(ox2, oy2, coreR, {
      isStatic: true,
      customInfo: { type: "q1ObstacleCore", radius: coreR }
    }),
    bars: [
      Bodies.rectangle(ox2, oy2, barL, barT, {
        isStatic: true,
        angle: 0,
        customInfo: { type: "q1ObstacleBar", width: barL, height: barT }
      }),
      Bodies.rectangle(ox2, oy2, barL, barT, {
        isStatic: true,
        angle: Math.PI / 2,
        customInfo: { type: "q1ObstacleBar", width: barL, height: barT }
      }),
      Bodies.rectangle(ox2, oy2, barL, barT, {
        isStatic: true,
        angle: Math.PI / 4,
        customInfo: { type: "q1ObstacleBar", width: barL, height: barT }
      }),
      Bodies.rectangle(ox2, oy2, barL, barT, {
        isStatic: true,
        angle: -Math.PI / 4,
        customInfo: { type: "q1ObstacleBar", width: barL, height: barT }
      })
    ]
  };

  World.add(world, [quest1Obstacle2.core, ...quest1Obstacle2.bars]);

  
}


/* ==================== Earth Quest 2 (left) ==================== */
let quest2ObjectsPlaced = false;
let quest2IntroShown = false;
let quest2Completed = false;
let earthKey2Obtained = false;

let quest2Citizens = [];
let quest2Scout = null;
let quest2DividerY = (h/2)-(h*.192);
let quest2MazeWalls = [];


function drawQuest2CaveFloor() {
  push();
  imageMode(CORNER);

  const tileW = max(8, floor(X(32) * 5));
  const tileH = max(8, floor(Y(32) * 5));

  for (let y = 0; y < h; y += tileH) {
    for (let x = 0; x < w; x += tileW) {
      image(dirt, x, y, tileW, tileH);
    }
  }

  pop();
}


// earthState = "earthQuest2"
function drawEarthQuest2() {

  //background
  drawQuest2CaveFloor();


  // where to spawn back in the mainroom when we leave this room
  mainroomEnterX = player.size + 10;
  mainroomEnterY = player.y;

  // apply gravity
  for (let b of boxes) {
    Matter.Body.applyForce(b, b.position, {
      x: gravDir.x * worldGrav,
      y: gravDir.y * worldGrav
    });
  }

  // build once
  if (!quest2ObjectsPlaced) {
    makeWallsAndObjectsQuest2();
    quest2ObjectsPlaced = true;
  }

  if (!quest2IntroShown) {
    startDialogue(ALLDIALOGUES.quest2Intro);
    quest2IntroShown = true;
  }

  fill(101, 67, 33);
  drawBodyRect(walls.divider);

  // maze walls
  fill(101, 67, 33);
  noStroke();
  for (let mw of quest2MazeWalls) {
    drawBodyRect(mw);
  }

  fill(7, 5, 4);
  noStroke();
  drawBodyRect(walls.bottom);
  drawBodyRect(walls.top);
  drawBodyRect(walls.left);
  drawBodyRect(walls.right1);
  drawBodyRect(walls.right2);
 

  if (walls.exitGate) {
    //drawBodyRect(walls.exitGate);
    image(rockImg, walls.exitGate.position.x, walls.exitGate.position.y-20, walls.exitGate.customInfo.width+100, walls.exitGate.customInfo.height+150);
  }


  // stroke(80, 120, 160, 120);
  // line(0, quest2DividerY, w, quest2DividerY);


  noStroke();
  for (let b of boxes) {
    if (b.customInfo && b.customInfo.type === "citizen") {
      fill(120, 200, 255);
      push();
      translate(b.position.x, b.position.y);
      rotate(b.angle);
      rectMode(CENTER);
      //rect(0, 0, b.customInfo.width, b.customInfo.height);

      image(minerImg, 0, 0, b.customInfo.width, b.customInfo.height);
      pop();
    } else if (b.customInfo && b.customInfo.type === "scout") {
      fill(200, 180, 90);
      push();
      translate(b.position.x, b.position.y);
      rotate(b.angle);
      rectMode(CENTER);
      //rect(0, 0, b.customInfo.width, b.customInfo.height);
      image(scoutImg, 0, 0, b.customInfo.width, b.customInfo.height);
      pop();
    } else {
      fill(120, 180, 220);
      drawBodyRect(b);
    }
  }

  if (quest2Scout && !quest2Completed && !dialogueState.active) {
    const sx = quest2Scout.position.x;
    const sy = quest2Scout.position.y;
    const d = dist(player.body.position.x, player.body.position.y, sx, sy);

    if (d < 60) {
      if (pixelFont) textFont(pixelFont);
      fill(255);
      textAlign(CENTER, BOTTOM);
      textSize(10);
      text("Press E to talk", sx, sy - 30);

      if (keyIsDown(69)) { 
        startDialogue(ALLDIALOGUES.quest2Intro);
        quest2IntroShown = true;
      }
    }
  }

  if (playerAABB().x > w - 10) {
    if (quest2Completed) {
      earthState = "earthMainroom";
      World.clear(world);
      boxes = [];
      walls = {};
      objectsPlacedMainroom = false;
      quest2ObjectsPlaced = false;
      return;
    } else {
      if (pixelFont) textFont(pixelFont);
      fill(255);
      textAlign(CENTER, CENTER);
      textSize(12);
      text(
        "I should get everyone\nout of the storm zone first.",
        player.x - 80,
        player.y - 30
      );
    }
  }

  player.move();
  player.display();

  checkQuest2Solved();

  drawHUD();
  drawDialogue();
}


function makeWallsAndObjectsQuest2() {

  player.resetBody(w - 80, h/2);

  boxes = [];
  quest2Citizens = [];
  quest2Scout = null;
  quest2MazeWalls = [];


  // outer walls
  walls.bottom = Bodies.rectangle(w / 2, h, w, thick, {
    isStatic: true,
    customInfo: { width: w, height: thick }
  });

  walls.top = Bodies.rectangle(w / 2, 0, w, thick, {
    isStatic: true,
    customInfo: { width: w, height: thick }
  });

  walls.left = Bodies.rectangle(0, h / 2, thick, h, {
    isStatic: true,
    customInfo: { width: thick, height: h }
  });

  walls.right1 = Bodies.rectangle(w, 0 - 80, thick, h, {
    isStatic: true,
    customInfo: { width: thick, height: h }
  });

  walls.right2 = Bodies.rectangle(w, h + 80, thick, h, {
    isStatic: true,
    customInfo: { width: thick, height: h }
  });


  const gapWidth = X(110);
  const dividerWidth = w - gapWidth;
  const dividerX = gapWidth + dividerWidth / 2;

  walls.divider = Bodies.rectangle(dividerX, quest2DividerY, dividerWidth, 10, {
    isStatic: true,
    customInfo: { width: dividerWidth, height: 10 }
  });

  World.add(world, [
    walls.bottom,
    walls.top,
    walls.left,
    walls.right1,
    walls.right2,
    walls.divider
  ]);

  if (!quest2Completed) {
    const gateHeight = 160;
    walls.exitGate = Bodies.rectangle(w, h / 2, thick, gateHeight, {
      isStatic: true,
      customInfo: { width: thick, height: gateHeight, type: "exitGate" }
    });
  } else {
    walls.exitGate = null;
  }
  if (walls.exitGate) World.add(world, walls.exitGate);


  const mazeThick = 16;
  const topY = thick + 1;
  const bottomY = quest2DividerY - 20;

  function addMazeWall(cx, cy, wWall, hWall) {
    const body = Bodies.rectangle(cx, cy, wWall, hWall, {
      isStatic: true,
      customInfo: { width: wWall, height: hWall }
    });
    quest2MazeWalls.push(body);
    return body;
  }



  // vertical 
  addMazeWall(w * 0.10, Y(85), X(10), Y(100));
  addMazeWall(w * 0.19, Y(65), X(10), Y(30));
  addMazeWall(w * 0.19, Y(130), X(10), Y(40));
  addMazeWall(w * 0.27, Y(100), X(10), Y(50));
  addMazeWall(w * 0.35, Y(105), X(10), Y(80));
  addMazeWall(w * 0.42, Y(100), X(10), Y(80));
  addMazeWall(w * 0.50, Y(60), X(10), Y(100));
  addMazeWall(w * 0.58, Y(100), X(10), Y(100));
  addMazeWall(w * 0.66, Y(50), X(10), Y(80));
  addMazeWall(w * 0.74, Y(100), X(10), Y(70));
  addMazeWall(w * 0.82, Y(70), X(10), Y(40));
  addMazeWall(w * 0.90, Y(80), X(10), Y(60));

  // horizontal 
  addMazeWall(w * 0.23, Y(80), X(155), Y(10));
  addMazeWall(w * 0.05, Y(220), X(100), Y(10));
  addMazeWall(w * 0.475, Y(100), X(75), Y(10));
  addMazeWall(w * 0.62, Y(125), X(50), Y(10));
  addMazeWall(w * 0.695, Y(90), X(50), Y(10));
  addMazeWall(w * 0.90, Y(125), X(100), Y(10));

  // mirrored verticals shifted down +100
  addMazeWall(w * 0.10, Y(225), X(10), Y(100));
  addMazeWall(w * 0.19, Y(245), X(10), Y(50));
  addMazeWall(w * 0.19, Y(150), X(10), Y(40));
  addMazeWall(w * 0.27, Y(180), X(10), Y(50));
  addMazeWall(w * 0.35, Y(220), X(10), Y(90));
  addMazeWall(w * 0.42, Y(210), X(10), Y(50));
  addMazeWall(w * 0.50, Y(220), X(10), Y(100));
  addMazeWall(w * 0.58, Y(180), X(10), Y(100));
  addMazeWall(w * 0.66, Y(230), X(10), Y(80));
  addMazeWall(w * 0.74, Y(200), X(10), Y(70));
  addMazeWall(w * 0.82, Y(260), X(10), Y(40));
  addMazeWall(w * 0.90, Y(250), X(10), Y(60));

  // mirrored horizontals shifted down +100
  addMazeWall(w * 0.23, Y(180), X(155), Y(10));
  addMazeWall(w * 0.455, Y(150), X(45), Y(10));
  addMazeWall(w * 0.62, Y(225), X(50), Y(10));
  addMazeWall(w * 0.695, Y(190), X(50), Y(10));
  addMazeWall(w * 0.90, Y(180), X(100), Y(10));



  World.add(world, quest2MazeWalls);
  

  const citizenCount = 5;
  for (let i = 0; i < citizenCount; i++) {
    const bx = random(w * 0.85, w * 0.95);
    const by = random(topY + 20, quest2DividerY - 80);
    const bw = X(20);
    const bh = Y(20);

    const body = Bodies.rectangle(bx, by, bw, bh, {
      friction: 0.4,
      frictionAir: w>1000? map(w, 400, 1600, 1.5, 0.8, true) : map(w, 400, 1600, 1.6, 2, true),
      restitution: 0.2,
      density: w > 1000 ? map(w, 400, 1600, .6, 0.3, true) : map(w, 400, 1600, 1.5, 0.9, true),
      customInfo: {
        width: bw,
        height: bh,
        type: "citizen"
      }
    });

    boxes.push(body);
    quest2Citizens.push(body);
  }

  /* ========== SCOUT (bottom region) ========== */

  const scoutW = 58;
  const scoutH = 58;
  const scoutBody = Bodies.rectangle(w * 0.18, h * 0.75, scoutW, scoutH, {
    friction: 0.4,
    frictionAir: 0.1,
    restitution: 0.2,
    density: .5,
    customInfo: {
      width: scoutW,
      height: scoutH,
      type: "scout"
    }
  });

  boxes.push(scoutBody);
  quest2Scout = scoutBody;

  World.add(world, boxes);
}



function checkQuest2Solved() {
  if (quest2Citizens.length === 0) return;

  let allOutside = true;

  for (let c of quest2Citizens) {
    const pos = c.position;
    // consider them "safe" once they are below the divider (bottom half)
    if (pos.y < quest2DividerY + 5) {
      allOutside = false;
      break;
    }
  }



  if (allOutside && !quest2Completed) {
    questCompletedSound.play();
    quest2Completed = true;
    earthKey2Obtained = true;
    startDialogue(ALLDIALOGUES.quest2Solved);

    if (walls.exitGate) {
      World.remove(world, walls.exitGate);
      walls.exitGate = null;
    }
  }
}

/* ==================== Earth Quest 3 (top) ==================== */
let quest3ObjectsPlaced = false;
let quest3IntroShown = false;
let quest3Completed = false;
let earthKey3Obtained = false;

let quest3Boss = null;
let quest3Sword = null;
let quest3Bullets = [];

let bossMaxHealth = 5;
let bossHealth = bossMaxHealth;

let playerMaxHealth = 5;
let playerHealth = playerMaxHealth;

let quest3FightReady = false;
let quest3FightStartFrame = 0;

let alive = true;

// earthState = "earthQuest3"

function drawQuest3WallBorders() {
  push();
  imageMode(CORNER);

  const thickPx = 70;
  const edgeW = 70;
  const edgeH = 70;

  // top and bottom
  for (let x = 0; x < w; x += edgeW) {
    image(side, x, 0, edgeW, thickPx);
    image(side, x, h - thickPx, edgeW, thickPx);
  }

  // left and right 
  for (let y = 0; y < h; y += edgeH) {
    image(down, 0, y, thickPx, edgeH);
    image(down, w - thickPx, y, thickPx, edgeH);
  }


  image(corner, 0, 0, thickPx, thickPx);

  image(corner, w - thickPx, 0, thickPx, thickPx);

  image(corner, 0, h - thickPx, thickPx, thickPx);

  image(corner, w - thickPx, h - thickPx, thickPx, thickPx);

  pop();

}

function drawQuest3Floor() {
  push();
  imageMode(CORNER);

  const tileW = max(8, floor(X(32) *2.5));
  const tileH = max(8, floor(Y(32) *2.5));

  for (let y = 0; y < h; y += tileH) {
    for (let x = 0; x < w; x += tileW) {
      image(tile, x, y, tileW, tileH);
    }
  }

  pop();
}

function drawEarthQuest3() {
  mainroomEnterX = player.x;
  mainroomEnterY = player.size + 10;

  //background
  drawQuest3Floor();
  push();
  rectMode(CORNER);
  fill(0, 0, 30, 180);
  rect(0, 0, w, h);
  pop();

  // gravity affects sword only (boxes array just holds sword here)
  for (let i = 0; i < boxes.length; i++) {
    let b = boxes[i];
    Matter.Body.applyForce(b, b.position, {
      x: gravDir.x * worldGrav,
      y: gravDir.y * worldGrav
    });
  }

  if (!quest3ObjectsPlaced) {
    makeWallsAndObjectsQuest3();
    quest3ObjectsPlaced = true;
  }

  if (!quest3IntroShown) {
    startDialogue(ALLDIALOGUES.quest3Intro);
    quest3IntroShown = true;
  }

  // once intro dialogue is gone, start a 1s countdown before bullets
  if (quest3IntroShown && !quest3FightReady && !dialogueState.active) {
    quest3FightReady = true;
    quest3FightStartFrame = frameCount;
  }

  // spawn bullets from boss while alive, only after delay
  if (
    !quest3Completed &&
    quest3Boss &&
    bossHealth > 0 &&
    quest3FightReady &&
    frameCount > quest3FightStartFrame + 60 &&
    frameCount % 50 === 0
  ) {
    
    const bossX = quest3Boss.position.x;
    const bossY = quest3Boss.position.y;

    const playerCX = player.x + player.size / 2;
    const playerCY = player.y + player.size / 2;

    const spread = 60;
    quest3Bullets.push(new Quest3Bullet(bossX, bossY+65, playerCX, playerCY));
    quest3Bullets.push(new Quest3Bullet(bossX, bossY+65, playerCX - spread, playerCY));
    quest3Bullets.push(new Quest3Bullet(bossX, bossY+65, playerCX + spread, playerCY));

    bulletSound.play();

  }

  // walls
  fill(200, 200, 255);
  noStroke();
  drawBodyRect(walls.top);
  drawBodyRect(walls.bottom1);
  drawBodyRect(walls.bottom2);
  drawBodyRect(walls.left);
  drawBodyRect(walls.right);

  drawQuest3WallBorders();

  push();
  rectMode(CORNER);
  fill(0,0,0,100);
  rect(0, 0, w, 70);
  rect(0, 0, 70, h);
  rect(w-70, 0, 70, h);
  rect(0, h-70, w, 70);

  pop();



  // bottom gate (door blocker)
  if (walls.bottomGate && !quest3Completed) {
    fill(0, 150);
    drawBodyRect(walls.bottomGate);
  } else {
    //tile path
    noStroke();
    image(tile, w / 2, h - 40, 200, 70);
    fill(0, 0, 30, 180);
    rect(w / 2, h - 40, 200, 70);
  }

  // boss
  if (quest3Boss && bossHealth > 0) {
    fill(220, 80, 80);
    push();
    translate(quest3Boss.position.x, quest3Boss.position.y);
    //make it always face the player
    const angleToPlayer = atan2(player.y - quest3Boss.position.y, player.x - quest3Boss.position.x);
    rotate(angleToPlayer + 3*PI/2);

    //ellipse(0, 0, quest3Boss.customInfo.radius * 2, quest3Boss.customInfo.radius * 2);
    image(bossImg, 0,0, quest3Boss.customInfo.radius * 2 + 30, quest3Boss.customInfo.radius * 2 + 30);
    pop();
  }

  // sword
  if (quest3Sword) {
    fill(240, 240, 120);
    //drawBodyRect(quest3Sword);

    push();
    translate(quest3Sword.position.x, quest3Sword.position.y);
    rotate(quest3Sword.angle);
    image(swordImg, 0, 0, quest3Sword.customInfo.width+ 35, quest3Sword.customInfo.height+10);
    pop();
    
  }

  //bullets (particle system)
  if (alive && bossHealth > 0) {
    for (let i = quest3Bullets.length - 1; i >= 0; i--) {
      let r = quest3Bullets[i].moveAndDisplay();
      if (!r) {
        quest3Bullets.splice(i, 1);
        i--;
      }
    }
  }
  
  if (playerHealth <= 0 && alive) {
    alive = false;
    showDeathScreen = true;
    deathSound.play();
  }

  if (showDeathScreen) {
    drawQuest3DeathScreen();
    return;
  }

  // exit only if boss is defeated
  if (playerAABB().y > h - 10) {
    if (quest3Completed) {
      earthState = "earthMainroom";
      World.clear(world);
      boxes = [];
      walls = {};
      quest3ObjectsPlaced = false;
      objectsPlacedMainroom = false;
      return;
    } else {
      if (pixelFont) textFont(pixelFont);
      fill(255);
      textAlign(CENTER, CENTER);
      textSize(12);
      text(
        "I cannot leave while the Guardian rages.",
        player.x,
        player.y - 30
      );
    }
  }

  player.move();
  player.display();

  // health UI
  if (bossHealth>0)drawQuest3HealthUI();



  if (bossHealth <= 0 && !quest3Completed) {
    questCompletedSound.play();
    quest3Completed = true;
    earthKey3Obtained = true;

    if (walls.bottomGate) {
      World.remove(world, walls.bottomGate);
      walls.bottomGate = null;
    }

    startDialogue(ALLDIALOGUES.quest3Solved);
  }
  

  drawHUD();
  drawDialogue();
}

function drawQuest3HealthUI() {

  //player
  const maxH = playerMaxHealth;
  const curH = constrain(playerHealth, 0, maxH);

  const heartS = min(X(50), Y(50));
  const pad = X(30);
  const gap = X(12);

  for (let i = 0; i < maxH; i++) {
    const x = w - pad - (i + 1) * heartS - i * gap;
    const y = pad;

    push();
    imageMode(CORNER);

    // empty heart (dim)
    tint(255, 70);
    image(heartImg, x, y, heartS, heartS);

    // filled heart
    if (i < curH) {
      tint(255, 255);
      image(heartImg, x, y, heartS, heartS);
    }
    pop();
  }

  //boss
  const barW = w * 0.5;
  const barH = Y(18);
  const barX = (w - barW) / 2;
  const barY = Y(54);

  const pct = bossMaxHealth > 0 ? constrain(bossHealth / bossMaxHealth, 0, 1) : 0;

  push();
  rectMode(CORNER);
  fill(255);
  textSize(30);
  stroke(0);
  strokeWeight(5);
  textAlign(CENTER,TOP);
  text("Earth Guardian", barX+barW/2, barY-Y(40));
  noStroke();

  // back bar (red)
  fill(255, 0, 0, 170);
  rect(barX, barY, barW, barH);

  // front bar (green)
  fill(0, 255, 0, 200);
  rect(barX, barY, barW * pct, barH);

  // outline
  noFill();
  stroke(255, 160);
  strokeWeight(2);
  rect(barX, barY, barW, barH);
  pop();
}


function makeWallsAndObjectsQuest3() {
  playerHealth = playerMaxHealth;

  quest3Bullets = [];
  boxes = [];

  alive = true;

  // reset fight timing
  quest3FightReady = false;
  quest3FightStartFrame = 0;

  // spawn player a bit higher up from the bottom
  player.resetBody(w / 2, h - 90);


  walls.bottom1 = Bodies.rectangle(0 - 80, h, w, thick, {
    isStatic: true,
    customInfo: { width: w, height: thick }
  });

  walls.bottom2 = Bodies.rectangle(w + 80, h, w, thick, {
    isStatic: true,
    customInfo: { width: w, height: thick }
  });

  walls.top = Bodies.rectangle(w / 2, 0, w, thick, {
    isStatic: true,
    customInfo: { width: w, height: thick }
  });

  walls.left = Bodies.rectangle(0, h / 2, thick, h, {
    isStatic: true,
    customInfo: { width: thick, height: h }
  });

  walls.right = Bodies.rectangle(w, h / 2, thick, h, {
    isStatic: true,
    customInfo: { width: thick, height: h }
  });

  World.add(world, [walls.top, walls.bottom1, walls.bottom2, walls.left, walls.right]);

  walls.bottomGate = Bodies.rectangle(w / 2, h , 80, thick, {
    isStatic: true,
    customInfo: { width: 160, height: thick, type: "gate" }
  });
  if (!quest3Completed) {
    World.add(world, walls.bottomGate);
  }

  // boss in the upper center
  const bossR = X(95);
  quest3Boss = Bodies.circle(w / 2, h * 0.28, bossR, {
    frictionAir: 0.01,
    restitution: 0.3,
    customInfo: { radius: bossR, type: "boss" }
  });
  World.add(world, quest3Boss);


  const swordW = 20
  const swordH = 90;
  quest3Sword = Bodies.rectangle(w / 2, h * 0.55, swordW, swordH, {
    frictionAir: 0.1,
    restitution: .7,
    density: 0.15,
    customInfo: { width: swordW, height: swordH, type: "sword" }
  });

  boxes.push(quest3Sword);
  World.add(world, boxes);
}

function mousePressed() {
  if (earthState === "earthQuest3" && showDeathScreen) {
    const inside =
      mouseX >= deathBtn.x &&
      mouseX <= deathBtn.x + deathBtn.w &&
      mouseY >= deathBtn.y &&
      mouseY <= deathBtn.y + deathBtn.h;

    if (inside) {
      showDeathScreen = false;
      resetQuest3(); // keeps your reset logic
      earthState = "earthQuest3"; // stay in quest3
      quest3IntroShown = false;   // optional: replay intro
    }
  }
}

let showDeathScreen = false;
let deathBtn = { x: 0, y: 0, w: 220, h: 70 };

function drawQuest3DeathScreen() {
  // background (reuse your floor)
  drawQuest3Floor();

  // dark cover
  push();
  rectMode(CORNER);
  noStroke();
  fill(0, 0, 0, 210);
  rect(0, 0, w, h);
  pop();

  // title
  push();
  if (pixelFont) textFont(pixelFont);
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(48);
  text("YOU DIED", w / 2, h * 0.35);
  textSize(16);
  fill(200);
  text("The Guardian crushed you.", w / 2, h * 0.42);
  pop();

  // button
  deathBtn.x = w / 2 - deathBtn.w / 2;
  deathBtn.y = h * 0.55;
  push();
  rectMode(CORNER);
  const hover =
    mouseX >= deathBtn.x &&
    mouseX <= deathBtn.x + deathBtn.w &&
    mouseY >= deathBtn.y &&
    mouseY <= deathBtn.y + deathBtn.h;

  noStroke();
  fill(hover ? 255 : 230);
  rect(deathBtn.x, deathBtn.y, deathBtn.w, deathBtn.h, 10);

  fill(0);
  if (pixelFont) textFont(pixelFont);
  textAlign(CENTER, CENTER);
  textSize(22);
  text("RETRY", deathBtn.x + deathBtn.w / 2, deathBtn.y + deathBtn.h / 2);
  pop();
}



class Quest3Bullet {
  constructor(bossX, bossY, playerX, playerY) {
    this.x = bossX;
    this.y = bossY;

    const dx = playerX - bossX;
    const dy = playerY - bossY;
    const hyp = Math.sqrt(dx * dx + dy * dy);

    const speed = 4;
    this.vx = (dx / hyp) * speed;
    this.vy = (dy / hyp) * speed;

    this.angle = Math.atan2(this.vy, this.vx);

    this.r = 10;
    this.size = 22;
  }

  moveAndDisplay() {

    push();
    translate(this.x, this.y);
    rotate(this.angle);
    imageMode(CENTER);
    if (frameCount % 5 == 0) scale(1, -1);
    image(bulletImg, 0, 0, this.size, this.size);
    pop();

    this.x += this.vx;
    this.y += this.vy;

    const px = player.x + player.size / 2;
    const py = player.y + player.size / 2;
    const pr = player.size * 0.6;

    const d = dist(this.x, this.y, px, py);
    if (!quest3Completed && d < pr + this.r) {
      playerHealth--;
      playerHitSound.play();
      return false;
    }

    //off screen
    if (this.x < -40 || this.x > w + 40 || this.y < -40 || this.y > h + 40) {
      return false;
    }

    return true;
  }
}






let lastBossHitFrame = 0;
function handleCollisionStart(event) {
  let pairs = event.pairs;

  for (let i = 0; i < pairs.length; i++) {
    let A = pairs[i].bodyA;
    let B = pairs[i].bodyB;

    let aType = A.customInfo && A.customInfo.type;
    let bType = B.customInfo && B.customInfo.type;

    if (
      ((aType === "sword" && bType === "boss") ||
        (aType === "boss" && bType === "sword")) &&
      !quest3Completed &&
      bossHealth > 0
    ) {
      if (frameCount - lastBossHitFrame >= 40) {
        lastBossHitFrame = frameCount;
        bossHealth--;
        bossHitSound.play();

        if (bossHealth <= 0) {
          quest3Completed = true;
          earthKey3Obtained = true;

          if (walls.bottomGate) {
            World.remove(world, walls.bottomGate);
            walls.bottomGate = null;
          }

          startDialogue(ALLDIALOGUES.quest3Solved);
        }
      }
    }
  }
}

function resetQuest3() {
  playerHealth = playerMaxHealth;
  bossHealth = bossMaxHealth;
  quest3Bullets = [];
  earthState = "earthMainroom";
  player.resetBody(w/2, h/2);
  World.clear(world);
  boxes = [];
  walls = {};
  quest3ObjectsPlaced = false;
}






/* ==================== gravity control ==================== */

function keyPressed() {
  if (!dialogueState.active) {
    //gravity control affects only Matter world
    if (keyCode === UP_ARROW) {
      gravDir.x = 0;
      gravDir.y = -1;
    }
    else if (keyCode === DOWN_ARROW) {
      gravDir.x = 0;
      gravDir.y = 1;
    }
    else if (keyCode === LEFT_ARROW) {
      gravDir.x = -1;
      gravDir.y = 0;
    }
    else if (keyCode === RIGHT_ARROW) {
      gravDir.x = 1;
      gravDir.y = 0;
    }
    else if (key === 'R' || key === 'r') {
      gravDir.x = 0;
      gravDir.y = 0;

      for (let b of boxes) {
        Matter.Body.setVelocity(b, { x: 0, y: 0 });
        Matter.Body.setAngularVelocity(b, 0);
      }
    }
  }
}


/* ==================== dialogue helpers ==================== */

let dialogueState = {
  active: false,
  name: "",
  image: null,
  dialogue: [],
  index: 0,
  canAdvance: false
};

// const ALLDIALOGUES = {
//   quest1Intro: {
//     name: "Crowd",
//     image: snobImgs[0],
//     lines: [
//       "You there, with the working legs. You see all these boxes around you?",
//       "We were people once. Then the gravity here went wild \nand now we seem to be just boxes",
//       "Our homes are still standing, but we cannot move on our own.",
//       "Use your gravity tricks to push each of us back to the \nhouse that matches our hat color.",
//       "Isn't that convenient?",
//       "Get everyone home safely and we will share something \nthat might help you on your journey."
//     ]
//   },
//   quest1Solved: {
//     name: "Crowd",
//     image: "player",
//     lines: [
//         "You did it. Everyone is home again.",
//         "Take this key. It might help you elsewhere in the caverns."
//     ]
//   },
//   quest2Intro: {
//     name: "Scout Crate",
//     image: "player",
//     lines: [
//       "The storm is getting worse. Gravity surges every few seconds.",
//       "Small ones cannot survive out there for long.",
//       "Guide them into the cave using your gravity shifts.",
//       "If the storm monster touches them, they will panic and scatter.",
//       "Protect them. The Second Earth Key is at the end of the cave."
//     ]
//   },
//   quest2Solved: {
//     name: "Survivors",
//     image: "player",
//     lines: [
//       "They made it… every last one of them.",
//       "The cave shields them from the gravity storms.",
//       "You kept them from shattering.",
//       "Take the Second Earth Key. One remains."
//     ]
//   },
//   quest3Intro: {
//     name: "Earth Guardian",
//     image: "player",
//     lines: [
//       "You should not be here, gravity-bearer.",
//       "The wizard's pawn always comes to collect.",
//       "This sword was sealed to stop monsters like me.",
//       "Use your cursed gift and see if you can still fight with honor."
//     ]
//   },
//   quest3Solved: {
//     name: "Fading Guardian",
//     image: "player",
//     lines: [
//       "So… the loop continues…",
//       "The wizard will lie to you, as he lied to us.",
//       "Take the Third Earth Key and remember my warning.",
//       "Gravity always demands a price."
//     ]
//   },
//   earthWorldSolved: {
//     name: "Crowd",
//     image: "player",
//     lines: [
//       "With all three keys gathered, the Earth World begins to stabilize.",
//       "Some of us may regain our bodies one day… because of you.",
//       "But the wizard still pulls the strings beyond the sky.",
//       "Go. Other worlds are suffering the same fate."
//     ]
//   }
// };

function startDialogue(dialogueObj) {
  if (!dialogueObj) return;

  dialogueState.active = true;
  dialogueState.name = dialogueObj.name;
  dialogueState.image = dialogueObj.image;
  dialogueState.dialogue = dialogueObj.lines;
  dialogueState.index = 0;
  dialogueState.canAdvance = true;

}

function drawDialogue() {
  if (!dialogueState.active) return;
  if (dialogueState.dialogue.length === 0) {
    dialogueState.active = false;
    return;
  }

  const line = dialogueState.dialogue[dialogueState.index];

  const sx = 2; 
  const sy = 2.2;

  // box geometry (scaled)
  const boxW = (w - 40);
  const boxH = 90 * sy;
  const boxX = 20;
  const boxY = height - boxH - 40 ;

  push();
  rectMode(CORNER);

  stroke(56, 78, 29);
  strokeWeight(4 * sx);
  fill(56, 78, 29, 120);
  rect(boxX, boxY, boxW, boxH);

  // portrait
  const pW = 75 * sx;
  const pH = 65 * sy;

  const pLeft = boxX + 20 * sx;
  const pTop = boxY + (boxH - pH) / 2;

  rectMode(CORNER);
  fill(255, 150);
  rect(pLeft, pTop, pW, pH);

  // draw image centered in that slot
  imageMode(CENTER);
  const pCX = pLeft + pW / 2;
  const pCY = pTop + pH / 2;

  if (dialogueState.image === "player") {
    drawCharacterAt(pCX, pCY, "normal", 60 * sx);
  } else {
    image(dialogueState.image, pCX, pCY, pW, pH);
  }

  // text
  if (pixelFont) textFont(pixelFont);
  fill(255);
  textAlign(LEFT, TOP);

  textSize(14 * sy);
  text(dialogueState.name, boxX + 110 * sx, boxY + 10 * sy);

  textSize(11 * sy);
  const textX = boxX + 110 * sx;
  const textY = boxY + 29 * sy;
  const textW = boxW - 90 * sx;
  text(line, textX, textY, textW, boxH - 36 * sy);

  // hint
  textAlign(RIGHT, BOTTOM);
  textSize(12 * sy);
  fill(200);
  text("[X] continue", boxX + boxW - 10 * sx, boxY + boxH - 6 * sy);

  pop();

  if (keyIsDown(88) && dialogueState.canAdvance) {
    dialogueState.canAdvance = false;
    startDialogueSound.play();
    dialogueState.index++;

    if (dialogueState.index >= dialogueState.dialogue.length) {
      dialogueState.active = false;
    }
  } else if (!keyIsDown(88)) {
    dialogueState.canAdvance = true;
  }
}




/* ==================== drawing helpers ==================== */


function drawBodyRect(body) {
  push();
  translate(body.position.x, body.position.y);
  rotate(body.angle);
  rect(0, 0, body.customInfo.width, body.customInfo.height);
  pop();
}

//hud for simple instructions

//earthState = "earthMainroom";
function drawHUD() {
  if (pixelFont) textFont(pixelFont);
  textAlign(LEFT, TOP);

  const pad = 18;
  const panelW = 270;
  const panelH = 150;

  // panel
  push();
  rectMode(CORNER);
  noStroke();
  fill(0, 0, 0, 120);
  rect(pad - 10, pad - 10, panelW, panelH);
  pop();

  // title + controls
  push();
  fill(255);
  textSize(20);
  text("Planet Hopper", pad, pad);
  text("Move: W A S D", pad, pad + 28);
  text("Gravity: Arrow Keys", pad, pad + 56);
  text("Reset: R", pad, pad + 84);
  pop();

  // if no gravity don't show arrow 
  const noGrav = (gravDir.x === 0 && gravDir.y === 0);
  if (noGrav) return;

  // rotation
  let dir = "none";
  let ang = 0;

  if (gravDir.x === 0 && gravDir.y < 0) { dir = "up"; ang = HALF_PI; }
  else if (gravDir.x === 0 && gravDir.y > 0) { dir = "down"; ang = -HALF_PI; }
  else if (gravDir.y === 0 && gravDir.x > 0) { dir = "right"; ang = PI; }
  else if (gravDir.y === 0 && gravDir.x < 0) { dir = "left"; ang = 0; }

  // arrow image
  const arrowSize = 48;
  const arrowX = pad + 150;
  const arrowY = pad + 122;

  push();
  fill(255);
  textSize(20);
  text("Gravity:", pad, pad + 112);
  pop();

  push();
  imageMode(CENTER);
  translate(arrowX, arrowY);
  rotate(ang);
  image(arrowImg, 0, 0, arrowSize, arrowSize);
  pop();

  // dir text next to arrow
  push();
  fill(255);
  textSize(20);
  textAlign(LEFT, CENTER);
  text(dir.toUpperCase(), arrowX + 35, arrowY);
  pop();
}



/* ==================== Player ==================== */
function playerAABB() {
  return { x: player.x, y: player.y, w: player.size, h: player.size };
}

function drawCharacterAt(x, y, mode, size) {
  let savedChar = JSON.parse(localStorage.getItem("custom_char")) || charState;

  let pantImg =
    mode === "left" ? char_pant_left :
      mode === "right" ? char_pant_right :
        mode === "top" ? char_pant :
          mode === "bottom" ? char_pant :
            char_pant;

  let faceImg =
    mode === "left" ? char_face_left :
      mode === "right" ? char_face_right :
        mode === "top" ? char_face :
          mode === "bottom" ? char_face :
            char_face;

  let hatImg =
    mode === "left" ? char_hat_left :
      mode === "right" ? char_hat_right :
        mode === "top" ? char_hat_top :
          mode === "bottom" ? char_hat :
            char_hat;

  tint(savedChar.face_color);
  image(faceImg, x - 10, y - 15, size, size);
  noTint();

  
  tint(savedChar.pant_color);
  image(pantImg, x - 10, y - 15, size, size);
  noTint();

  tint(savedChar.hat_color);
  image(hatImg, x - 10, y - 15, size, size);
  noTint();
}

class Player {
  constructor(x, y) {
    this.size = 70;
    this.mode = "normal";

    this.speedForce = 200;
    this.maxSpeed = 70;

    this.body = Bodies.rectangle(x, y, this.size, this.size, {
        isStatic: false,
        friction: 100,
        frictionAir: 1,
        restitution: 0,
        density: 2.5,
        customInfo: {
          type: "player"
        },
      }
    );
    World.add(world, this.body);

    this.x = x ;
    this.y = y; 
  }

  resetBody(x, y) {
    if (this.body) {
      World.remove(world, this.body);
    }

    this.body = Bodies.rectangle(x, y, this.size, this.size, {
      isStatic: false,
      friction: 100,
      frictionAir: 1,
      restitution: 0,
      density: 2.5,
      customInfo: { type: "player" }
    });

    World.add(world, this.body);

    this.syncFromBody();
  }
    

  syncFromBody() {
    const pos = this.body.position;
    this.x = pos.x - this.size / 2;
    this.y = pos.y - this.size / 2;

    
    // push();
    // noFill();
    // stroke("red");
    // rectMode(CENTER);
    // rect(pos.x, pos.y, this.size, this.size);
    // pop();
  }

  display() {
    this.drawCharacter(this.x, this.y, this.mode);
  }

  drawCharacter(x, y, mode = this.mode) {
    let savedChar = JSON.parse(localStorage.getItem("custom_char")) || charState;

    let pantImg =
      mode === "left" ? char_pant_left :
        mode === "right" ? char_pant_right :
          mode === "top" ? char_pant :
            mode === "bottom" ? char_pant :
              char_pant;

    let faceImg =
      mode === "left" ? char_face_left :
        mode === "right" ? char_face_right :
          mode === "top" ? char_face :
            mode === "bottom" ? char_face :
              char_face;

    let hatImg =
      mode === "left" ? char_hat_left :
        mode === "right" ? char_hat_right :
          mode === "top" ? char_hat_top :
            mode === "bottom" ? char_hat :
              char_hat;

    const s = this.size * (1.35);

    tint(savedChar.face_color);
    image(faceImg, x + 35, y+25, s, s);
    noTint();

    tint(savedChar.pant_color);
    image(pantImg, x + 35, y+25, s, s);
    noTint();

    tint(savedChar.hat_color);
    image(hatImg, x + 35, y+25, s, s);
    noTint();
  }

  move() {

    if (dialogueState.active) return;

    if (keyIsDown(68)) {
      Matter.Body.applyForce(this.body, this.body.position, { x: this.speedForce, y: 0 });
      this.mode = "right";
    }
    if (keyIsDown(65)) {
      Matter.Body.applyForce(this.body, this.body.position, { x: -this.speedForce, y: 0 });
      this.mode = "left";
    }
    if (keyIsDown(87)) {
      Matter.Body.applyForce(this.body, this.body.position, { x: 0, y: -this.speedForce });
      this.mode = "top";
    }
    if (keyIsDown(83)) {
      Matter.Body.applyForce(this.body, this.body.position, { x: 0, y: this.speedForce });
      this.mode = "normal";
    }

    let v = this.body.velocity;
    let vx = constrain(v.x, -this.maxSpeed, this.maxSpeed);
    let vy = constrain(v.y, -this.maxSpeed, this.maxSpeed);
    if (vx !== v.x || vy !== v.y) {
      Matter.Body.setVelocity(this.body, { x: vx, y: vy });
    }

    this.syncFromBody();

  }
}

