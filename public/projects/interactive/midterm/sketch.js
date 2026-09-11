let gameState = "earth";
//let gameState = "title";
const w = 600, h= 400;

willReadFrequently = true;

let levelHitMap;
let showHitmap = false;


let charState = {
  face_color: "#af8746ff",
  hat_color: "#37447bff",
  pant_color: "#cb1d1dff"
}

// dummy buttons
let startButton = null;
let proceedButton = null;
let backButton = null;

let earthX = 0, airX = 0, waterX = 0, mapY = 0, planetR = 28;

// player
let player;


let pixelFont, char_hat, char_face, char_pant, char_hat_left, char_face_left, char_pant_left, char_hat_right, char_face_right, char_pant_right, char_hat_top;
let parallax = [];
let grassBackground;
let tree1, tree2;
let grassHill;
let pot;
let plants =[]; 
let can;

let redGem, greenGem, blueGem;

let gIdleImg, gDeathImg;
let collectGem, gameWon, portalOpen, clickButton, shootBullet;

let portalIMG;
let gameOver;
let bgMusic;

function preload(){
  collectGem = loadSound("media/sounds/collect.wav");
  gameWon = loadSound("media/sounds/jingle.wav");
  portalOpen = loadSound("media/sounds/portalopen.mp3");
  //also used on interact (e)
  clickButton = loadSound("media/sounds/select.wav");
  shootBullet = loadSound("media/sounds/shoot.wav");
  gameOver = loadSound("media/sounds/gameOver.mp3");
  bgMusic = loadSound("media/sounds/prancingAbout.wav");

  bgMusic.setVolume(0.10);

  loveSFX = loadSound("media/sounds/love.mp3");
  energySFX = loadSound("media/sounds/energy.mp3");
  waterSFX = loadSound("media/sounds/water.mp3");

  gameOver.setVolume(0.2);
  collectGem.setVolume(0.2);  
  gameWon.setVolume(0.05);
  portalOpen.setVolume(0.3);
  clickButton.setVolume(0.2);
  shootBullet.setVolume(0.1);

  loveSFX.setVolume(0.05);
  energySFX.setVolume(0.05);
  waterSFX.setVolume(0.5);

  char_hat = loadImage("globalImages/character/char_hat.png");
  char_face = loadImage("globalImages/character/char_face.png");
  char_pant = loadImage("globalImages/character/char_pant.png");

  // Left
  char_hat_left = loadImage("globalImages/character/char_hat_left.png");
  char_face_left = loadImage("globalImages/character/char_face_left.png");
  char_pant_left = loadImage("globalImages/character/char_pant_left.png");

  // Right
  char_hat_right = loadImage("globalImages/character/char_hat_right.png");
  char_face_right = loadImage("globalImages/character/char_face_right.png");
  char_pant_right = loadImage("globalImages/character/char_pant_right.png");

  //top
  char_hat_top =  loadImage("globalImages/character/char_hat_top.png");

  custom_char = JSON.parse(localStorage.getItem('custom_char'));
  if (custom_char) {
      charState = custom_char;
  }

  //font
  pixelFont = loadFont('media/pixelify_sans/pixelifysans-variablefont_wght.ttf');

  // decor loads
  grassBackround = loadImage('media/images/background.png');

  //tree
  tree1 = loadImage("media/images/tree1.png");
  tree2 = loadImage("media/images/tree2.png");

  //spaceship
  spaceship = loadImage("media/images/spaceship.png");

  //forestBackground
  forestBack = loadImage("media/images/forestBackground.jpg")

  // parallax layers
  for (let i = 10, j = 1; i > 0; i--, j++) {
    parallax[j] = loadImage("media/images/parallax/parallax" + i + ".png");
  } 

  //grass hill
  grassHill = loadImage("media/images/grassHill.png");

  //pot and growth stages
  pot = loadImage("media/images/pot.png");

  for (let i = 1; i <= 8; i++) {
    plants[i] = loadImage("media/images/plants/plant" + i + ".png");
  }

  can = loadImage("media/images/can.png");

  //gems
  redGem = loadImage("media/images/red.png");
  blueGem = loadImage("media/images/blue.png");
  greenGem = loadImage("media/images/green.png");

  //golem
  // gIdle = createImg("media/images/golemidle.gif");
  // gDeath = createImg("media/images/golemdeath.gif");
  gIdleImg = loadImage("media/images/golemidle.gif");
  gDeathImg = loadImage("media/images/golemdeath.gif");

  // [gIdle, gDeath].forEach(el => {
  //   el.hide();
  //   el.attribute("draggable", "false");
  //   el.style("pointer-events", "none");
  // });

  portalIMG = loadImage("media/images/portal.gif");
}

function setup() {
  createCanvas(w, h);
  noSmooth();

  // make the buffer and use it as the hitmap the Player reads from
  levelHitMap = createGraphics(w, h);
  levelHitMap.noSmooth();

  // spawn location (can change per level later)
  player = new Player(width/2, height/2);

  for (let i = 1; i <= 10; i++) parallaxOffsets[i] = 0;
}

function draw() {
  background(18, 26, 34);
  noStroke();
  if (!bgMusic.isPlaying()) bgMusic.loop();
  if (gameState == "earth") {
    drawEarth();
  }
  textFont(pixelFont);

}

/* ==================== helpers ==================== */

function drawButton(x, y, w, h, label) {
  fill(245);
  stroke(0); strokeWeight(2);
  rect(x, y, w, h);
  noStroke(); fill(20);
  textAlign(CENTER, CENTER); textSize(14);
  text(label, x + w/2, y + h/2-3);
  return { x, y, w, h };
}

function mouseOver(r) {
  return r && mouseX >= r.x && mouseX <= r.x + r.w && mouseY >= r.y && mouseY <= r.y + r.h;
}

function playerAABB() { return { x: player.x, y: player.y, w: player.size, h: player.size }; }
function overlaps(a,b) { return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y; }

function drawCharacterAt(x, y, mode, size) {
  let savedChar = JSON.parse(localStorage.getItem("custom_char")) || charState;

  let pantImg = mode === "left" ? char_pant_left : (mode === "right" ? char_pant_right : (mode === "top" ? char_pant : mode === "bottom" ? char_pant : char_pant));
  let faceImg = mode === "left" ? char_face_left : (mode === "right" ? char_face_right : (mode === "top" ? char_face : mode === "bottom" ? char_face : char_face));
  let hatImg  = mode === "left" ? char_hat_left : (mode === "right" ? char_hat_right : (mode === "top" ? char_hat_top : mode === "bottom" ? char_hat : char_hat));

  tint(savedChar.face_color);
  image(faceImg, x-10, y-15, size,size);
  noTint();

  tint(savedChar.hat_color);
  image(pantImg, x-10, y-15, size, size);

  noTint();


  tint(savedChar.pant_color);
  image(hatImg, x-10, y-15, size,size);
  noTint();

  //console.log("drawing character at ", x, y, " in mode ", mode); 
}


/* ==================== mouse + keys Pressing (interactivity)==================== */

function mousePressed() {

  if (gameState == "earth" && earthState == "cutscene1") {
    clickButton.play();
    earthState = "cutscene2";
  }
  else if (gameState == "earth" && earthState == "cutscene2") {
    clickButton.play();
    earthState = "earthMainroom";
    player.x = width/2; 
    player.y = height/2;  
  }

  else if (mouseOver(wateringCanButton) && !energyEquipped) {
    clickButton.play();
    wateringCanEquipped = !wateringCanEquipped;
  }

  else if (mouseOver(energyButton) && !wateringCanEquipped) {
    clickButton.play();
    energyEquipped = !energyEquipped;
  }

  else if (mouseOver(backButton) && gameState == "earth" && earthState == "earthGreenroom"){
    clickButton.play();
    earthState = "earthMainroom";
    player.y = 30;
    //reset variabless
    wateringCanEquipped = false;
    energyEquipped = false;
    love = 0;
    energy = 0;
    water = 0;
  } 
}



let earthState = "earthMainroom"; 
//earthState = "earthGreenroom";

/* ==================== Earth ==================== */
function drawEarth() {
  if (earthState == "cutscene1") {
    drawEarthCutscene1();
  } 
  else if (earthState == "cutscene2") {
    drawEarthCutscene2();
  } 
  else if (earthState == "earthMainroom") {
    drawEarthMainRoom();
    doorBlueMain.unlocked = true;
  }
  else if (earthState == "earthBlueroom") {
    drawEarthBlueRoom();
  }
  else if (earthState == "earthGreenroom") {
    drawEarthGreenRoom();
  }
  else if (earthState == "earthRedroom") {
    drawEarthRedRoom();
  }
  else if (earthState == "earthRedFight") {
    drawEarthRedFight();
  }
}

function drawEarthCutscene1() {
  background(0);
  textAlign(CENTER, CENTER);
  textSize(20);
  text("Approaching Earth domain...", width/2, height*0.85);

}
function drawEarthCutscene2() {
  background(0);
  textAlign(CENTER, CENTER);
  textSize(20);
  text("Approaching Earth domain...", width / 2, height * 0.85);

}

// tree dimensions (4:5 aspect)
let treeW = 75;
let treeH = Math.round(treeW * 5 / 4); // 62 or 63 depending on rounding

function drawTreeBorders() {
  noTint();

  const cols = Math.floor(w / treeW);
  const rows = Math.floor(h / treeH);


  //left
  for (let j = 0, y = 0; j < rows; j++, y += treeH-10) {
    if (doorRedMain.unlocked && j === 2 && earthState =="earthMainroom") continue;
    else if (!doorRedMain.unlocked && j === 2 && earthState =="earthMainroom") {image(tree2, 0, y, treeW, treeH); continue;}

    if (doorBlueMain.unlocked && j === 2 && earthState =="earthBlueroom") continue;
    else if (!doorBlueMain.unlocked && j === 2 && earthState == "earthBlueroom") {image(tree2, 0, y, treeW, treeH); continue;}

    if (j === 1 && earthState == "earthMainroom") continue;
    image(tree1, 0, y, treeW, treeH); 
  }

  //right
  for (let j = 0, y = 0; j < rows; j++, y += treeH-10) {
    if (doorBlueMain.unlocked && j === 2 && earthState == "earthMainroom") continue;
    else if (!doorBlueMain.unlocked && j === 2 && earthState == "earthMainroom") {image(tree2, w - treeW, y, treeW, treeH); continue;}

    if (doorRedMain.unlocked && j === 2 && earthState == "earthRedroom") continue;
    else if (!doorRedMain.unlocked && j === 2 && earthState == "earthRedroom") {image(tree2, w - treeW, y, treeW, treeH); continue;}

    if (j === 1 && earthState == "earthMainroom") continue;
    image(tree1, w - treeW, y, treeW, treeH); 

  }

  //bottom
  for (let i = 0, x = 0; i < cols; i++, x += treeW) {
    //if (i === 0 || i === cols - 1) continue;
    if (doorGreenMain.unlocked && i === 4 && earthState=="eathGreenroom") continue;
    image(tree1, x, h - treeH, treeW, treeH);
  }
  
}

function drawTreeBordersTop(){
  noTint();

  const cols = Math.floor(w / treeW);
  const rows = Math.floor(h / treeH);

  //top
  for (let i = 0, x = 0; i < cols-1; i++, x += treeW-3) { 
    if (doorGreenMain.unlocked && i === 4 && earthState == "earthMainroom") continue;
    image(tree1, x, 0, treeW, treeH); 
  }

  //left
  for (let j = 0, y = 0; j < rows; j++, y += treeH-10) {
    if (j === 1 && earthState =="earthMainroom"){ 
      image(tree1, 0, y, treeW, treeH);
    }
  }

  //right
  for (let j = 0, y = 0; j < rows; j++, y += treeH-10) {
    if (j === 1 && earthState == "earthMainroom")
      image(tree1, w - treeW, y, treeW, treeH); 
  }

}


let doorRedMain = { x: 8, y: h/2, w: 20, h: 60 , unlocked: false};      // left wall
let doorBlueMain = { x: w - 28, y: h/2, w: 20, h: 60 , unlocked: true};// right wall
let doorGreenMain = { x: w/2,  y: 8, w: 60, h: 20 , unlocked: false};   // top wall
 
let earthSpaceship = { x: w/2 - 20, y: h - 60, w: 40, h: 40 };

let mainMsg = "";
let mainMsgTime = 0;
const mainMsgDuration = 1500;

let portalActive = false;
const portalRect = { x: 430, y: 200, w: 80, h: 90 };
const portalNear = { x: 400, y: 180, w: 90, h: 100 };

const holderRect = { x: 210, y: 265, w: 180, h: 70 };
const nearRect = { x: 190, y: 245, w: 220, h: 110 };

let objectiveStr = "Head right and beat the blue trial";

function drawObjective() {
  if (earthState === "earthGreenroom" || earthState == "earthRedFight") return;

  textFont(pixelFont);
  textSize(12);
  textAlign(LEFT, TOP);

  const label = "Objective:   (use WASD to move)";
  const padX = 10, padY = 8, gap = 4;

  const wLabel = textWidth(label);
  const wLine = textWidth(objectiveStr);
  const boxW = padX * 2 + Math.max(wLabel, wLine);
  const boxH = padY * 2 + 12 + gap + 12;

  noStroke();
  fill(0, 170);
  rect(10, 10, boxW +10, boxH);

  fill(255);
  text(label, 10 + padX, 10 + padY);
  text(objectiveStr, 10 + padX, 10 + padY + 12 + gap);
}

function drawEarthMainRoom() {

  // gIdle.hide();
  // gDeath.hide();

  //allbuttons back to null
  wateringCanButton = null;
  energyButton = null;


  doorBlueMain.x = w - 28;
  doorRedMain.x = 8;
  doorGreenMain.y = 8;


  const wall = 75; // wall thickness
  const floorCol = color(113, 119, 27, 0);
  const wallCol  = color(90,110,130);
  const doorCol  = color(120,130,150);

  // floor
  //background(floorCol);
  image(grassBackround, 0,0, w,h);

  //green marker top
  fill(35, 110, 60, 200);
  rect(doorGreenMain.x - 5, -20, doorGreenMain.w, 100);

  drawTreeBordersTop();

  //walls
  // noStroke(); fill(wallCol);
  // rect(0, 0, w, wall);
  // rect(0, h - wall, w, wall);
  // rect(0, 0, wall, h);
  // rect(w - wall, 0, wall, h);



  //doors
  // fill(doorCol);
  // rect(doorGreenMain.x, 0, doorGreenMain.w, wall);
  // rect(0, doorRedMain.y, wall, doorRedMain.h);
  // rect(w - wall, doorBlueMain.y, wall, doorBlueMain.h);

  // carve visual gaps for unlocked doors
  fill(floorCol);

  //top gap
  // if (doorGreenMain.unlocked) rect(doorGreenMain.x, 0, doorGreenMain.w, wall); 
  // //left gap
  // if (doorRedMain.unlocked) rect(0, doorRedMain.y-20, wall, doorRedMain.h);  
  // //right gap
  // if (doorBlueMain.unlocked) rect(w - wall, doorBlueMain.y+10, wall, doorBlueMain.h); 


  // door markers
  noStroke();
  //red marker left
  fill( 120,40,4, 200);
  rect(-35, doorRedMain.y-10, 100, doorRedMain.h);
  //blue marker right
  fill( 40,70,110, 200);
  rect(w - wall +10, doorBlueMain.y-10, 100, doorBlueMain.h);

  //hit map
  levelHitMap.clear();
  levelHitMap.noStroke();
  levelHitMap.fill(255);
  levelHitMap.rect(0, 0, w, h);

  levelHitMap.fill(0);

  // bottom wall
  levelHitMap.rect(0, h - wall - 25, w, wall);

  // left wall
  levelHitMap.fill(0);
  levelHitMap.rect(0, 0, wall, h);
  if (doorRedMain.unlocked) {
    levelHitMap.fill(255);
    levelHitMap.rect(0, doorRedMain.y-25, wall, doorRedMain.h+25);
  }
  if (doorRedMain.unlocked && overlaps(playerAABB(), doorRedMain)) {
    earthState = "earthRedroom";
    player.x = w - wall - player.size - 20;
    player.y = doorRedMain.y + doorRedMain.h / 2 - player.size / 2;
  }

  // right wall
  levelHitMap.fill(0);
  levelHitMap.rect(w - wall, 0, wall, h);
  if (doorBlueMain.unlocked) {
    levelHitMap.fill(255);
    levelHitMap.rect(w - wall, doorBlueMain.y-25, wall+25, doorBlueMain.h+25);
  }
  if (doorBlueMain.unlocked && overlaps(playerAABB(), doorBlueMain)) {
    earthState = "earthBlueroom";
    player.x = wall + 2;
    player.y = doorBlueMain.y + doorBlueMain.h / 2 - player.size / 2;
  }

  // top wall
  levelHitMap.fill(0);
  levelHitMap.rect(0, 0, w, wall);
  if (doorGreenMain.unlocked){
    levelHitMap.fill(255);
    levelHitMap.rect(doorGreenMain.x-10, 0, doorGreenMain.w+10, wall);
  }
  if (doorGreenMain.unlocked && overlaps(playerAABB(), doorGreenMain)) {
    earthState = "earthGreenroom";
    player.x = doorGreenMain.x + doorGreenMain.w / 2 - player.size / 2;
    player.y = h - wall - player.size - 2;
  }

  //spaceship
  push(); 
  translate(250, 150);
  rotate(radians(140)); 
  image(spaceship, 0,0, 150,150);
  pop();

  levelHitMap.fill(0);
  levelHitMap.rect(50,50, 150,130); // spaceship hitbox

  // eRed =true;
  // eGreen=true;
  // eBlue=true;
  

  // gem holders
  noStroke();
  fill(60, 78, 96);
  rect(210, 265, 180, 70);

  // slots (light bluish grey)
  fill(170, 190, 210);
  rect(220, 275, 46, 50);
  rect(276, 275, 46, 50);
  rect(332, 275, 46, 50);

  // gems inside slots
  if (eRed) image(redGem, 226, 281, 34, 38);
  if (eGreen) image(greenGem, 282, 281, 34, 38);
  if (eBlue) image(blueGem, 338, 281, 34, 38);

  // collision
  levelHitMap.fill(0);
  levelHitMap.rect(210, 265, 180, 70);


  if (mainMsg && millis() - mainMsgTime < mainMsgDuration) {
    noStroke();
    fill(0, 200);
    rect(150, 350 - 64, 300, 28);
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(12);
    text(mainMsg, 300, 300);
  }

  // player
  player.move();
  player.display();

  drawTreeBorders();

  if (overlaps(playerAABB(), nearRect) && !portalActive) {
    const prompt = "Press E to interact";
    noStroke();
    fill(0, 180);
    rect(player.x -60, player.y - 32, 160, 18);
    fill(255);
    textAlign(CENTER, TOP);
    textSize(12);
    text(prompt, player.x + 20, player.y - 30);

    // interaction on E
    if (keyIsDown(69)) {
      if (eRed && eGreen && eBlue) {
        portalActive = true;
        objectiveStr = "Enter the portal";
        portalOpen.play();
      } else {
        mainMsg = "You need more gems to activate the mechanism.";
        mainMsgTime = millis();
      }
    }
  }

  if (portalActive) {
    noStroke();
    fill(30, 150, 220, 220);
    //rect(portalRect.x, portalRect.y, portalRect.w, portalRect.h);
    image(portalIMG, portalRect.x, portalRect.y, portalRect.w, portalRect.h)

    // portal hitbox
    levelHitMap.fill(0);
    levelHitMap.rect(portalRect.x, portalRect.y, portalRect.w, portalRect.h);

    // portal prompt
    if (overlaps(playerAABB(), portalNear)) {
      noStroke();
      fill(0, 180);
      rect(portalRect.x - 40, portalRect.y - 22, portalRect.w + 80, 18);
      fill(255);
      textAlign(CENTER, TOP);
      textSize(12);
      text("Press E to interact", portalRect.x + portalRect.w / 2, portalRect.y - 20);

      if (keyIsDown(69)) {
        //console.log("Portal used!");
        window.location.href = '../karenMidterm/index.html';
      }
    }
  }

  drawObjective();
}

////////////////////BLUE///////////////////////
let eBlue = false;
let beginBlueChallenge = true;
let earthBlueLost = false;
let earthBlueWon = false;
let bSpeedX = 3;
let bSpeedY = 3;
let bullets = [];

let timeIntervalBlue = 1000; // milliseconds
let lastTimeBlue = 0;
let timeNowBlue = 0;

let gameWonPlayed = false;
let bulletsDodgedBlue = 0;
function drawEarthBlueRoom() {
  const wall = 75; // wall thickness
  const floorCol = color(50,70,90);
  const wallCol  = color(90,110,130);
  const doorCol  = color(120,130,150);

  doorBlueMain.x = 0;


  // floor
  // background(floorCol);

  //walls
  // noStroke(); fill(wallCol);
  // rect(0, 0, w, wall);
  // rect(0, h - wall, w, wall);
  // rect(0, 0, wall, h);
  // rect(w - wall, 0, wall, h);

  image(grassBackround, 0,0, w,h);

  drawTreeBordersTop();


  //hit map
  levelHitMap.clear();
  levelHitMap.noStroke();
  levelHitMap.fill(255);
  levelHitMap.rect(0, 0, w, h);

  levelHitMap.fill(0);

  // bottom wall
  levelHitMap.rect(0, h - wall, w, wall);

  // left wall
  levelHitMap.fill(0);
  levelHitMap.rect(0, 0, wall, h);

  // right wall
  levelHitMap.fill(0);
  levelHitMap.rect(w - wall, 0, wall, h);

  // top wall
  levelHitMap.fill(0);
  levelHitMap.rect(0, 0, w, wall);

  //door gap left (bc right door)
  // fill(floorCol);
  // rect(0, doorBlueMain.y, wall, doorBlueMain.h); 

  

  if (doorBlueMain.unlocked) {
    levelHitMap.fill(255);
    levelHitMap.rect(0, doorBlueMain.y-20, wall, doorBlueMain.h+20);
  }else{
    levelHitMap.fill(0);
    levelHitMap.rect(0, doorBlueMain.y, wall, doorBlueMain.h);
    // fill(doorCol);
    // rect(0, doorBlueMain.y, wall, doorBlueMain.h); 

  
  }
  if (doorBlueMain.unlocked && overlaps(playerAABB(), doorBlueMain)) {
    earthState = "earthMainroom";
    player.x = w - wall - player.size - 20;
    player.y = doorBlueMain.y + doorBlueMain.h / 2 - player.size / 2;
    //reset blue room variables
    doorBlueMain.unlocked = true; 
    beginBlueChallenge = true;
    earthBlueLost = false;
    bSpeedX = 3;
    bSpeedY = 3;
    bullets = [];
    bulletsDodgedBlue = 0;
    lastTimeBlue = 0;
  }

  //console.log( beginBlueChallenge, !earthBlueLost, !earthBlueWon)
  if (player.x > w/5 && beginBlueChallenge && !earthBlueLost && !earthBlueWon && earthState === "earthBlueroom") {
    doorBlueMain.unlocked = false;
    beginBlueChallenge = false;
    shootBullet.play();
    for (let i =0 ; i<4 ; i++){
      bullets.push(new Bullet());
    }
    
    lastTimeBlue = millis();
  }

  for (let i =0 ; i< bullets.length ; i++){
    bullets[i].moveAndDisplay();

    if (bullets[i].x < -10 || bullets[i].x > width +10 || bullets[i].y < -10 || bullets[i].y > height +10){
      bullets.splice(i,1);
      i--;
    }
  }

  //every 1000 millis make new bullets and increase speed
  timeNowBlue = millis();
  //console.log(timeNowBlue - lastTimeBlue > timeIntervalBlue  && doorBlueMain.unlocked && !earthBlueLost && !earthBlueWon)
  if (timeNowBlue - lastTimeBlue > timeIntervalBlue && !doorBlueMain.unlocked && !earthBlueLost && !earthBlueWon) {
    shootBullet.play();
    for (let i =0 ; i<4 ; i++){
      bullets.push(new Bullet());
    }
    lastTimeBlue = timeNowBlue;
    bSpeedX += 0.25;
    bSpeedY += 0.25;
    bulletsDodgedBlue += 8;
  }

  if (bulletsDodgedBlue >= 50) {
    earthBlueWon = true;
    doorBlueMain.unlocked = true;
    objectiveStr = "Head left and beat the red trial";
  }

  // player
  if (!earthBlueLost){
    player.move();
    player.display();
  }

  drawTreeBorders();

  if (earthBlueLost) {
    fill(0,0,255,150);
    rect(0,0,width,height);
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(32);
    text("It can't end like this!", width/2, height/2);

    //respawn button
    backButton = drawButton(width/2 - 60, height*0.75, 120, 36, "Respawn");
    if (mouseOver(backButton) && mouseIsPressed){
      //reset everything back to main room
      earthState = "earthMainroom";
      player.x = width/2; 
      player.y = height/2;
    
      //reset blue room variables
      doorBlueMain.unlocked = true;
      beginBlueChallenge = true;
      earthBlueLost = false;
      bSpeedX = 2;
      bSpeedY = 2;
      bullets = [];
      bulletsDodgedBlue = 0;
    }
  }

  //win
  if (earthBlueWon) {
    if (!gameWonPlayed) {
      gameWon.play();
      gameWonPlayed = true;
    }
    //clear bullets
    bullets = [];

    //blue gem appears (rn just blue rectangle)
    fill(0,0,255);
    if(!eBlue){
      // rect(w/2, h/2, 10, 20); 
      image(blueGem, w/2 -20, h/2-20, 50,50);
    }
    //player walks on top to collect it
    if (overlaps(playerAABB(), {x: w/2, y: h/2, w: 10, h: 20}) && !eBlue) {
      eBlue = true;
      collectGem.play();
      doorRedMain.unlocked = true;
    }
    
    doorBlueMain.unlocked = true;

  }


  drawObjective();
  
}

class Bullet{
  constructor(){
    this.speedX = bSpeedX;
    this.speedY = bSpeedY;
    
    //start from any side randomly
    //only go vertically or horizontally not diagonally
    if (random(1) > 0.5){
      this.x = random([-10, width+10]);
      this.y = random(500);
      if (this.x > 0){
        this.speedX = -abs(this.speedX);
        
      }else{
        this.speedX = abs(this.speedY);
      }this.speedY = 0;
      

    }
    else{
      this.y = random([-10, width+10]);
      this.x = random(500); 
      if (this.y < 0){
        this.speedY = abs(this.speedY);
        
      }else{
        this.speedY = -abs(this.speedY);
      }
      this.speedX = 0;
      
    }
    
    this.r = 3.5;

  }
  moveAndDisplay(){
    fill("blue");
    noStroke();
    
    //draw
    ellipse(this.x, this.y , 7,7);
    
    this.x += this.speedX;
    this.y += this.speedY;
    
    //if bullet hits player
    const px = player.x + player.size / 2;
    const py = player.y + player.size / 2;
    const pr = player.size * 0.6;

    const d = dist(this.x, this.y, px, py);
    if (d < pr + this.r) {
      earthBlueLost = true;
      gameOver.play();
    }
    
  }
}

////////////////////RED///////////////////////
let eRed = false;

// earthState = "earthRedroom";
function drawEarthRedRoom() {
  const wall = 75; // wall thickness
  const floorCol = color(50,70,90);
  const wallCol  = color(90,110,130);
  const doorCol  = color(120,130,150);

  doorRedMain.x = w - 28;

  // floor
  background(floorCol);
  image(grassBackround, 0,0, w,h);

  drawTreeBordersTop();

  //walls 
  // fill(wallCol);
  // rect(wall, 0, w - wall * 2, wall);
  // rect(wall, h - wall, w - wall * 2, wall);
  // rect(0, 0, wall, h);
  // rect(w - wall, 0, wall, h);

  // gap
  // fill(floorCol);
  // rect(w - wall, h/2, wall, 50)

  //hit map
  levelHitMap.clear();
  levelHitMap.noStroke();
  levelHitMap.fill(255);
  levelHitMap.rect(0, 0, w, h);

  levelHitMap.fill(0);

  // bottom wall
  levelHitMap.rect(0, h - wall, w, wall);

  // left wall
  levelHitMap.fill(0);
  levelHitMap.rect(0, 0, wall, h);

  // right wall
  levelHitMap.fill(0);
  levelHitMap.rect(w - wall, 0, wall, h);

  // top wall
  levelHitMap.fill(0);
  levelHitMap.rect(0, 0, w, wall);


  //door gab right bc left door 
  if (doorRedMain.unlocked) {
    levelHitMap.fill(255);
    levelHitMap.rect(w-wall, doorRedMain.y-20, wall, doorRedMain.h+20);
  }else{
    levelHitMap.fill(0);
    levelHitMap.rect(w-wall, doorRedMain.y, wall, doorRedMain.h);
    // fill(doorCol);
    // rect(0, doorRedMain.y, wall, doorRedMain.h); 
  }


  if (doorRedMain.unlocked && overlaps(playerAABB(), doorRedMain)) {
    earthState = "earthMainroom";
    player.x =  wall + player.size + 20;
    player.y = doorRedMain.y + doorRedMain.h / 2 - player.size / 2;
    // gDeath.hide();
    // gIdle.hide();
  }


  //display a message temporarily at the bottom of the screen
  ///later

  // gIdle.hide();
  // gDeath.hide();

  if (!earthRedWon) {
    //enemy
    // gIdle.position(w / 2 + 40, h / 2 +20);
    // gIdle.size(100, 100);
    // gIdle.show();
    image(gIdleImg, w / 2 -50, h / 2  -50, 100, 100);

    if (player.x > w / 2 - 70 && player.x < w / 2 + 70 && player.y > h / 2 - 70 && player.y < h / 2 + 70) {
      earthState = "earthRedFight";
    }
  } else {
    //red gem appears (rn just red rectangle)
    //fill(255,0,0);

    if(!eRed){
      //rect(w/2, h/2, 10, 20); 
      image(redGem, w/2-20, h/2-20, 50,50)
    }
    //player walks on top to collect it
    if (overlaps(playerAABB(), { x: w / 2, y: h / 2, w: 10, h: 20 }) && !eRed) {
      eRed = true;
      collectGem.play();
      doorGreenMain.unlocked = true;
      objectiveStr = "Head up and grow the plant";
    }
  }

  // player
  player.move();
  player.display();

  drawTreeBorders();

  drawObjective();
  
}

let playerHP = 100;
let enemyHP = 100;
let playerDMG = 10;
let enemyDMG = 15;

let turn = "player";
 
let enemyDelay = 800;
let timeNowEnemy = 0;

let playerDefend = false;

let healsLeft = 3;

let earthRedLost = false;
let earthRedWon = false;



// battle message
let battleMsg = "";
let msgTime = 0;
const msgDuration = 1350;

let baseX, baseY, btnW, padRight, padBottom;

let deathAnimStart = 0;
let deathAnimDuration = 900;

function drawEarthRedFight() {
  // cutscene of fight start like pokemon maybe maybe dont do that too complicated

  //background
  push();
  image(forestBack, 0,0, w, h);
  fill(0, 0, 0, 70); 
  rect(0, 0, w, h);
  pop();

  //fight
  //red enemy but bigger and top right
  // fill(255, 0, 0);
  // rect(w/2 + 100, h/2 - 80, 50, 100);
  // fill(0);
  // ellipse(w/2+110, h/2-70, 10, 10);
  // ellipse(w/2+140, h/2-70, 10, 10)
  // ;

  //gDeath.hide();

  // golem
  // gIdle.position(w / 2 + 105, h / 2 - 60);
  // gIdle.size(150, 150);
  // gIdle.show();

  //if (earthRedLost || earthRedWon) {gIdle.hide();}

  if (!earthRedLost && !earthRedWon) {
    image(gIdleImg, w / 2 + 30, h / 2 -130, 150, 150);
  }

  // player but bigger and bottom left
  drawCharacterAt(w/3 - 115, h/2 , "top", 150);

  //display player and enemy health bars
  //enemy
  fill(255, 0, 0);
  rect(w / 2 + 50, h / 2 + 30, 100, 10);
  fill(0, 255, 0);
  rect(w / 2 + 50, h / 2 + 30, enemyHP, 10);

  //enemy hp text
  fill(255); 
  textAlign(LEFT, TOP);
  textSize(18);
  text(enemyHP + "/100", w / 2 + 85, h / 2 + 42); 

  //player
  fill(255, 0, 0);
  rect(w / 2 - 200, h / 2 + 160, 100, 10);
  fill(0, 255, 0);
  rect(w / 2 - 200, h / 2 + 160, playerHP, 10);

  //player hp text
  fill(255);
  textAlign(RIGHT, TOP); 
  textSize(18);
  text(playerHP + "/100", w / 2 - 135, h / 2 + 172);

  if (!earthRedWon && !earthRedLost) {

    
    if (turn === "player" && playerHP > 0) {

      // Player's turn logic here

      
      //4 choices (attack, defend, heal, boost dmg)

      //display options
      btnW = 140, btnH = 28, btnGap = 8;
      padRight = 50; padBottom = 30;
  
      baseX = w - (btnW * 2 + btnGap) - padRight;
      baseY = h - (btnH * 2 + btnGap) - padBottom;

      let attackButton = drawButton(baseX, baseY, btnW, btnH, "Attack");
      let defendButton = drawButton(baseX + btnW + btnGap, baseY, btnW, btnH, "Defend");
      let healButton = drawButton(baseX, baseY + btnH + btnGap, btnW, btnH, "Heal (" + healsLeft + ")");
      let boostButton = drawButton(baseX + btnW + btnGap, baseY + btnH + btnGap, btnW, btnH, "Boost DMG");

      //attack
      if (mouseIsPressed && mouseOver(attackButton)) {
        clickButton.play();
        enemyHP -= playerDMG;
        battleMsg = "You dealt " + playerDMG + " dmg";
        msgTime = millis();
        turn = "enemy";
      }

      //defend
      else if (mouseIsPressed && mouseOver(defendButton)) {
        clickButton.play();
        playerDefend = true;
        battleMsg = "You brace for impact";
        msgTime = millis();
        turn = "enemy";
      }

      //heal
      else if (mouseIsPressed && mouseOver(healButton)) {
        clickButton.play();
        if (healsLeft > 0) {
          healsLeft--;
          let healAmt = 35;
          if (playerHP + healAmt > 100) healAmt = 100 - playerHP;
          playerHP += healAmt;
          battleMsg = "You healed " + healAmt + " HP";
          msgTime = millis();
          turn = "enemy";
        }
        else {
          battleMsg = "No heals left";
          msgTime = millis();
          turn = "player";
          //play a wrong sound actually
        }
      }

      //boostt
      else if (mouseIsPressed && mouseOver(boostButton)) {
        clickButton.play();
        playerDMG += 5;
        battleMsg = "You boosted +5 DMG";
        msgTime = millis();
        turn = "enemy";
      }

      timeNowEnemy = millis();

    } else {
      // Enemy's turn logic here
      //add a delay here to not be instant
      if (millis() - timeNowEnemy > enemyDelay) {
        let actualEnemyDMG = playerDefend ? Math.round(enemyDMG / 2.5) : enemyDMG;
        playerHP -= actualEnemyDMG;
        if (playerDefend) playerDefend = false;

        battleMsg = "Enemy dealt " + actualEnemyDMG + " dmg";
        msgTime = millis();

        if (enemyHP > 0) turn = "player";
      }
    }
  }
  // show last action message
  if (millis() - msgTime < msgDuration && battleMsg) {
    // message box same size as the 2x2 menu
    const boxW = btnW * 2 + btnGap; 
    const boxH = btnH * 2 + btnGap;
    const msgBoxX = baseX;
    const msgBoxY = baseY;

    push();
    stroke(0);
    strokeWeight(3);
    fill(255);
    rect(msgBoxX, msgBoxY, boxW, boxH);

    fill(0);
    noStroke();
    textAlign(LEFT, TOP);
    const pad = 8;
    const prevSize = textSize();
    textSize(18);
    text(battleMsg, msgBoxX + pad, msgBoxY + pad);
    textSize(prevSize);
    pop();
  }

  if (playerHP < 0) playerHP = 0;
  if (enemyHP < 0) enemyHP = 0;

  if (enemyHP <= 0 && !earthRedWon) {
    enemyHP = 0;
    earthRedWon = true;
    turn = "player";
    timeNowEnemy = millis();
    playerDefend = false;
    deathAnimStart = millis(); 
    battleMsg = "Enemy defeated!";
    msgTime = millis();
  }
  else if (playerHP <= 0 && !earthRedLost) {
    earthRedLost = true;
    gameOver.play();
  }

  if (earthRedWon && deathAnimStart && millis() - deathAnimStart >= deathAnimDuration) {
    earthState = "earthRedroom";  
    deathAnimStart = 0;
    gameWon.play();
  }



  if (earthRedLost){
    fill(255,0,0,150);
    rect(0,0,width,height);
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(32);
    text("It can't end like this!", width/2, height/2);

    //respawn button
    backButton = drawButton(width/2 - 60, height*0.75, 120, 36, "Respawn");
    if (mouseOver(backButton) && mouseIsPressed){
      //reset everything back to main room for red
      earthState = "earthMainroom";
      playerHP = 100;
      enemyHP = 100;
      playerDMG = 10;
      enemyDMG = 15;

      turn = "player";
      
      enemyDelay = 500;
      timeNowEnemy = 0;

      playerDefend = false;

      healsLeft = 3;

      earthRedLost = false;
      earthRedWon = false;
      deathAnimStart = 0;
      // gDeath.hide();
      // gIdle.hide();
    }
  }


}

////////////////////GREEN///////////////////////

let parallaxOffsets = []; 
let parallaxSpeeds = [0, 0.07, 0.1, 0.2, 0.3, 0.6, .1, 0, 0,0, 0];



function drawParallaxBackground() {
  // sky layers, slower in back, faster in front
  for (let i = 1; i <= 10; i++) {
    parallaxOffsets[i] -= parallaxSpeeds[i];
    if (i == 5) continue;
    // wrap when a full screen has scrolled
    if (parallaxOffsets[i] <= -w) parallaxOffsets[i] += w;

    // draw twice to cover the whole width
    image(parallax[i], parallaxOffsets[i], -60, w, h);
    image(parallax[i], parallaxOffsets[i] + w, -60, w, h);
  }
}

let eGreen = false;
let love = 0;
let energy = 0;
let water = 0;

let plantGrowth = 0;
let plant

let wateringCanButton = null;
let wateringCanEquipped = false;

let energyButton = null;
let energyEquipped = false;

let waterParticles = [];

let potX = w/2 - 90;  
let potY = h/2 + 10; 

let energyParticles = [];

let loveParticles =[];
let maxPlantGrowth = 300; 

let gameWonPlayed2 = false;
//earthState = "earthGreenroom"
function drawEarthGreenRoom() {
  //no walking just plant and background

  //draw background
  drawParallaxBackground()

  //draw static grass
  // fill(19,109,21);
  // rect(0, h - h/3.5, w, 115);
  image(grassHill,0, h-h/3.5, 600, 160);
  fill(0, 50);
  rect(0, h - h / 3.5, 600, 160);

  //draw pot
  // fill(158,82,63);
  // rect(potX, potY, 80,90);
  image(pot, potX, potY, 170, 170); 

  // fill(64,41,5);
  // rect(potX +10, potY+10, 60,40);

  

  push();

  

  //draw plant growing from pot change logic later to use pngs
  // fill(0, 255, 0);
  // rect(potX +35, potY +30 - plantGrowth, 10, plantGrowth);



  // draw plant PNG based on percent growth using 8 explicit ifs with literal sizes/positions
  let g = constrain(plantGrowth / maxPlantGrowth, 0, 1);
  //plantGrowth = 95;
  
  

  if (g < 1 / 8) {
    //image(plants[1], potX + 45, potY + 37, 20, 20);
    //seed
    fill(10, 90, 10);
    rect(potX + 80, potY + 45, 10, 10);  
  }
  else if (g < 2 / 8) {
    image(plants[2], potX + 60, potY - 25, 40 , 80);
  }
  else if (g < 3 / 8) {
    image(plants[3], potX + 55, potY - 50, 60, 105); 
  }
  else if (g < 4 / 8) {
    image(plants[4], potX + 40, potY - 90, 90, 145); 
  }
  else if (g < 5 / 8) {
    image(plants[5], potX + 40, potY - 105, 90, 155);   
  }
  else if (g < 6 / 8) {
    image(plants[6], potX + 40, potY - 115, 90, 165);
  }
  else if (g < 7 / 8) {
    image(plants[7], potX + 35, potY -125, 100, 175); 
  }
  else {
    image(plants[8], potX + 30, potY - 145, 110, 195);
  }



  //now based on actions, add to love, water, energy

  //press Z for watering can
  //mouse can follows user
  //use particles class and objects for water

  //energy makes the pot shake


  //love: you just have to drag ur mouse and pet the plant
  //have to unequip the watering can
  //used mouse dragged function below

  for (let i = 0; i < loveParticles.length; i++) {
    let valid = loveParticles[i].moveAndDisplay()
    if (!valid) {
          // this particle is no longer useful!
          loveParticles.splice(i, 1)
          i -= 1
      }
  }

 

  if (wateringCanEquipped){
    //draw watering can at mouse
    image(can, mouseX+5, mouseY-15, 50,50); 
  }

  for (let i = 0; i < waterParticles.length; i++) {
    let valid = waterParticles[i].moveAndDisplay()
    if (!valid) {
          // this particle is no longer useful!
          waterParticles.splice(i, 1)
          i -= 1
      }
  }

  //have th meters deplete
  if (plantGrowth < maxPlantGrowth){
    love -= 0.04;
    water -= 0.04;
    energy -= .04;
  }

  if (love < 0) love = 0;
  if (water < 0) water = 0;
  if (energy < 0) energy = 0;



  if (love >= 70 && water >= 70 && energy >= 70 && !eGreen){
    plantGrowth += 0.5;
  }

  if (plantGrowth > maxPlantGrowth) plantGrowth = maxPlantGrowth;


  //energy: press E that shakes the ground/pot and releases yellow energy particles particles
  energyButton = drawButton(w - 240, h-40, 120, 30, energyEquipped ? "Unequip Energy" : "Equip Energy");

  if (energyEquipped){
    //text saying press E to release the energy from the red gem
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(16);
    text("Press E to release energy", w - 170, h - 70); 
  }

  for (let i = 0; i < energyParticles.length; i++) {
    let valid = energyParticles[i].moveAndDisplay()
    if (!valid) {
          // this particle is no longer useful!
          energyParticles.splice(i, 1)
          i -= 1
      }
  }

  //console.log(plantGrowth); 
  
  //back button
  backButton = drawButton(10, h - 40, 100, 30, "Back");

  //watering can equip/unequip
  wateringCanButton = drawButton(w - 110, h-40, 100, 30, wateringCanEquipped ? "Unequip Can" : "Equip Can");


  //to do now plant growth animation
  //when plantGrowth reaches certain levels set eGreen to true
  //win condition
  //plantGrowth = maxPlantGrowth;
  if (plantGrowth >= maxPlantGrowth && !eGreen){
    //green gem appears (rn just green rectangle)
    //press it to collect
    if (!gameWonPlayed2){
      gameWon.play();
      gameWonPlayed2 = true;
    }
    textAlign(CENTER, CENTER);
    textSize(12);

    fill(0, 100);
    rect(w/2 - 150,2.5, 300, 35); 

    fill(255);
    text("Plant has providend you with the green gem!", w/2, 10);
    text("Click it to collect!", w/2, 25); 
    
    strokeWeight(0);
    
    image(greenGem, w/2-25, 30, 50,50); 
  }

  //check if player clicks it
  if (mouseIsPressed && overlaps({ x: mouseX, y: mouseY, w: 1, h: 1 }, { x: w / 2 - 25, y: 30, w: 50, h: 50 }) && plantGrowth >= maxPlantGrowth && !eGreen){
    eGreen = true;
    collectGem.play();
    objectiveStr = "Interact with the gems at the bottom of main room"
  }


  //background to meters
  fill(0, 100); 
  rect(10,10, 120, 100);


  //different meters (love, water, energy)
  strokeWeight(2);
  stroke(255);

  //love
  fill(170, 0,0);
  rect(16, 30, 100, 10); 
  fill(255, 150, 150);
  rect(16, 30, love, 10);
  

  //water
  fill(170, 0,0); 
  rect(16, 60, 100, 10); 
  fill(156, 200, 255); 
  rect(16, 60, water, 10);
 
  //energy
  fill(170, 0,0);
  rect(16, 90, 100, 10); 
  fill(247, 162, 51);
  rect(16, 90, energy, 10);
  
  pop();
  textSize(10);
  fill(255);
  textAlign(LEFT, CENTER);
  text('Love', 16, 21);
  text('Water', 16, 51);
  text('Energy', 16, 81);


  //background to hints
  fill(0, 150);
  rect(10, 115, 120, 239);   

  // hints / directions
  fill(255);
  textAlign(LEFT, TOP);
  textSize(10);
  textLeading(14);

  text("Directions", 16, 121);

  let hints =
    "• Keep all meters high to grow the plant.\n\n" +
    "• You can equip only one thing at a time.\n\n" +
    "• Water: equip the can.\n\n" +
    "• Energy: equip energy, press E.\n\n" +
    "• Love: unequip, then drag the mouse to pet.";

  text(hints, 16, 139, 108);


}
//earthState = "earthGreenroom";
let movePot = 5;
let lastLoveAt = 0;

let lovePlaying = false;
let waterPlaying = false;
function keyPressed(){
  if (gameState == "earth" && earthState == "earthGreenroom" && energyEquipped){
    if (key == 'E' || key == 'e') {
      energy += 5;
      energySFX.play();
      if (energy > 100) energy = 100;

      //create energy particles that go up from the pot
      for (let i =0 ; i<5 ; i++){
        let temp = new EnergyParticle(random(potX + 20, potX +140), potY +120);
        // put into array
        energyParticles.push(temp);
      }

      potX += movePot;
      movePot *= -1;

    } 
  }

}

function mouseDragged(){
  if (gameState == "earth" && earthState == "earthGreenroom"){
    //check if mouse is over the plant pot area
    if (frameCount % 10 == 0 && !wateringCanEquipped){
      let temp = new LoveParticle(mouseX, mouseY)
      // put into array
      loveParticles.push(temp);
    }
    if (mouseX > w/2 -50 && mouseX < w/2 +30 && mouseY > h/3 && mouseY < h/2 +140 && !wateringCanEquipped ){
      love += 0.6;
      if (love > 100) love = 100;

      if (!lovePlaying && loveSFX) {
        loveSFX.loop();
        lovePlaying = true;
      }
    } 

    if (wateringCanEquipped){
      let temp = new WaterParticle(mouseX, mouseY)
        // put into array
      waterParticles.push(temp)
      //check if mouse is over the plant pot area
      if (mouseX > w/2 -50 && mouseX < w/2 +30 && mouseY < 300){ 
        water += 0.6;
        if (water > 100) water = 100;

        if (!waterPlaying && waterSFX) {
          waterSFX.loop();
          waterPlaying = true;
        }
      } else {
        if (waterPlaying && waterSFX) {
          waterSFX.stop();
          waterPlaying = false;
        }
      
      }
    }
  }
}

function mouseReleased() {
  if (waterPlaying && waterSFX) { waterSFX.stop(); waterPlaying = false; }
  if (lovePlaying && loveSFX) { loveSFX.stop(); lovePlaying = false; }
}

class WaterParticle{
  constructor(x, y) {
      this.x = x
      this.y = y
      this.xSpeed = random(-1, 1);
      this.ySpeed = random(2, 3);
      this.alpha = 200;
      this.radius = random(10, 30);
  }
  moveAndDisplay() {
      fill(0, 0, 255, this.alpha);
      noStroke();
      this.x += this.xSpeed;
      this.y += this.ySpeed;
      ellipse(this.x, this.y, this.radius, this.radius);
      this.alpha -= 3;

      if (this.alpha < 0) {
          return false;
      }
      else {
          return true;
      }

  }
}

class EnergyParticle{
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.xSpeed = random(-1, 1);
    this.ySpeed = random(-3, -2);
    this.alpha = 200;
    this.radius = random(10, 30);
  }
  moveAndDisplay() {
    fill(255, 255, 0, this.alpha);
    noStroke();
    this.x += this.xSpeed;
    this.y += this.ySpeed;
    
    //thunderbolts random rotation
    push();
    translate(this.x, this.y);
    rotate(random(-0.5, 0.5));
    beginShape();
    vertex(0, -this.radius);
    vertex(this.radius/3, 0);
    vertex(-this.radius/3, 0);
    vertex(0, this.radius);
    endShape(CLOSE);
    pop();

    if (this.alpha < 0) {
        return false;
    }else {
        this.alpha -= 3;
        return true;
    }
  }
}

class LoveParticle{
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.xSpeed = random(-1, 1);
    this.ySpeed = random(-3, -2);
    this.alpha = 200;
    this.radius = random(10, 30);
    this.size = random(12, 24);
    this.rotateAngle = radians(random(-50, 50));
    this.change = random([radians(1), radians(-1)]);
  }
  moveAndDisplay() {
    fill(255, 150, 150, this.alpha);
    noStroke();
    //draw heart shape
    push();
    translate(this.x, this.y);
    rotate(this.rotateAngle);
    this.rotateAngle += this.change;

    const s = this.size;

    beginShape();
    vertex(0, -0.30 * s);
    // right lobe to bottom
    bezierVertex(0.50 * s, -0.85 * s, 1.10 * s, -0.05 * s, 0, 0.70 * s);
    // bottom to left lobe and back to top
    bezierVertex(-1.10 * s, -0.05 * s, -0.50 * s, -0.85 * s, 0, -0.30 * s);
    endShape(CLOSE);

    pop();
    this.x += this.xSpeed;
    this.y += this.ySpeed;

    if (this.alpha < 0) {
        return false;
    }else {
        this.alpha -= 3;
        return true;
    }
  }
}
/* ============ Player class ============ */
class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 25;
    this.speed = 3;
    this.c = color(0, 255, 0); 
    this.mode = "normal";
  }
  display() {
    // stroke(avatarColor[0],avatarColor[1],avatarColor[2]);
    // fill(this.color);
    // rect(this.x, this.y, this.size, this.size);

    this.drawCharacter(this.x, this.y, this.mode);
    
  }
  drawCharacter(x, y, mode = this.mode) {
    let savedChar = JSON.parse(localStorage.getItem("custom_char")) || charState;

    let pantImg = mode === "left" ? char_pant_left : (mode === "right" ? char_pant_right : (mode === "top" ? char_pant : mode === "bottom" ? char_pant : char_pant));
    let faceImg = mode === "left" ? char_face_left : (mode === "right" ? char_face_right : (mode === "top" ? char_face : mode === "bottom" ? char_face : char_face));
    let hatImg  = mode === "left" ? char_hat_left : (mode === "right" ? char_hat_right : (mode === "top" ? char_hat_top : mode === "bottom" ? char_hat : char_hat));


    tint(savedChar.face_color);
    image(faceImg, x-10, y-15, 50,50);
    noTint();

    tint(savedChar.hat_color);
    image(pantImg, x-10, y-15, 50,50);

    noTint();


    tint(savedChar.pant_color);
    image(hatImg, x-10, y-15, 50,50);
    noTint();

    //console.log("drawing character at ", x, y, " in mode ", mode); 
  }

  computeSensors() {
    this.middleX = this.x + this.size / 2;
    this.middleY = this.y + this.size / 2;
    this.left = this.x - 2;
    this.right = this.x + this.size + 2;
    this.up = this.y - 2;
    this.down = this.y + this.size + 2;
  }
  move() {
    this.computeSensors();
    this.color = color(0, 255, 0);

    // right
    if (keyIsDown(68)) {
      let p = red(levelHitMap.get(this.right, this.middleY));
      if (p == 255) {
        this.x += this.speed;
      } else {
        this.color = color(255, 0, 0);
      }
      this.mode = "right";
    }
    // left
    if (keyIsDown(65)) {
      let p = red(levelHitMap.get(this.left, this.middleY));
      if (p == 255) {
        this.x -= this.speed;
      } else {
        this.color = color(255, 0, 0);
      }
      this.mode = "left";
    }
    // up
    if (keyIsDown(87)) {
      let p = red(levelHitMap.get(this.middleX, this.up));
      if (p == 255) {
        this.y -= this.speed;
      } else {
        this.color = color(255, 0, 0);
      }
      
      this.mode = "top";
      
    }
    // down
    if (keyIsDown(83)) {
      let p = red(levelHitMap.get(this.middleX, this.down));
      if (p == 255) {
        this.y += this.speed;
      } else {
        this.color = color(255, 0, 0);
      }
      
      this.mode = "normal";
      
    }

  }
}