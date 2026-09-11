let enemies = [];
let score = 0, highScore = 0;
let totalKills = 0, killsSinceBoss = 0;
let escaped = 0;
let gameOver = false;
let gameStarted = false;
let startBtn = { x: 0, y: 0, w: 220, h: 56 };
let backBtn = { x: 0, y: 0, w: 260, h: 48 };

const MAX_ENEMIES = 7;
const BASE_SPAWN_MS = 1600;
const MIN_SPAWN_MS = 600;

const GUNS = {
  handgun: { name: "Handgun", dmg: 2, clip: 3, radius: 22, reloadMs: 1000 },
  shotgun: { name: "Shotgun", dmg: 1, clip: 2, radius: 56, reloadMs: 1400 },
  sniper:  { name: "Sniper",  dmg: 3, clip: 1, radius: 10, reloadMs: 2000 },
};

let gunKey = "handgun";

// Each weapon has independent state
let weaponState = {};
for (const k in GUNS) {
  weaponState[k] = {
    ammo: GUNS[k].clip,
    reloading: false,
    reloadEndsAt: 0
  };
}

let lastSpawn = 0;
let parallaxImgs = [];
let parallaxOffsets = [0,0,0,0,0,0,0];

let pixelFont; // Add font variable

let enemySpriteSheets = {
  small: { idle: null, die: null },
  medium: { idle: null, die: null },
  tanky: { idle: null, die: null }
};

// Update these numbers to match the actual frame counts in your PNGs
const ENEMY_ANIMS = {
  small: { idle: 6, die: 15 },  
  medium: { idle: 8, die: 13}, 
  tanky: { idle: 8, die: 17 } 
};

let sounds = {};
let musicState = {
  home: null,
  game: null,
  over: null,
  current: null
};

// Load images before setup
function preload() {
  for (let i = 1; i <= 7; i++) {
    parallaxImgs.push(loadImage(`media/forest/${i}.png`));
  }
  pixelFont = loadFont('media/pixelify_sans/pixelifysans-variablefont_wght.ttf');

  enemySpriteSheets.small.idle =  loadImage('media/flyingforestenemies_premium/enemy1/enemy1-movement-in-animation/enemy1-flyidle.png');
  enemySpriteSheets.small.die  =  loadImage('media/flyingforestenemies_premium/enemy1/enemy1-movement-in-animation/enemy1-diev2.png');
  enemySpriteSheets.medium.idle = loadImage('media/flyingforestenemies_premium/enemy2/enemy2-movement-in-animation/enemy2-idlefly.png');
  enemySpriteSheets.medium.die  = loadImage('media/flyingforestenemies_premium/enemy2/enemy2-movement-in-animation/enemy2-die.png');
  enemySpriteSheets.tanky.idle =  loadImage('media/flyingforestenemies_premium/enemy3/enemy3-movement-in-animation/enemy3-fly.png');
  enemySpriteSheets.tanky.die  =  loadImage('media/flyingforestenemies_premium/enemy3/enemy3-movement-in-animation/enemy3-die.png');

  sounds.bossEnter = loadSound('media/sound/bossenter.mp3');
  sounds.gameMusic = loadSound('media/sound/gamemusic.mp3');
  sounds.gameover = loadSound('media/sound/gameover.mp3');
  sounds.handgun = loadSound('media/sound/handgun.mp3');
  sounds.home = loadSound('media/sound/home.mp3');
  sounds.kill1 = loadSound('media/sound/kill1.mp3');
  sounds.kill2 = loadSound('media/sound/kill2.mp3');
  sounds.shotgun = loadSound('media/sound/shotgun.mp3');
  sounds.sniper = loadSound('media/sound/sniper.mp3');
}

let lastKillSoundTime = 0;
let gameOverSoundPlayed = false;
let gameOverSoundStopTimer = 0;

// Helper to draw a frame from a horizontal sprite sheet
function drawSpriteFrame(sheet, frameCount, frameIdx, x, y, w, h) {
  let fw = sheet.width / frameCount;
  imageMode(CENTER);
  image(sheet, x, y, w, h, fw * frameIdx, 0, fw, sheet.height);
  imageMode(CORNER);
}

function playMusic(track) {
  if (musicState.current && musicState.current.isPlaying()) {
    musicState.current.stop();
  }
  if (track && !track.isPlaying()) {
    track.loop();
    musicState.current = track;
  }
}

function setup() {
  let canvas = createCanvas(800, 500);
  canvas.parent(document.getElementById('canvasContainer'));
  textFont(pixelFont);
  pixelDensity(1);
  noSmooth();
  // Load highscore from localStorage
  highScore = Number(localStorage.getItem("highscore")) || 0;
  musicState.home = sounds.home;
  musicState.game = sounds.gameMusic;
  musicState.over = sounds.gameover;
  // Delay playing home music until loaded
  if (musicState.home && musicState.home.isLoaded()) {
    playMusic(musicState.home);
  } else {
    musicState.home.onended = null;
    musicState.home.onloadedmetadata = () => playMusic(musicState.home);
  }
}

function draw() {
  background(18, 120, 176);

  drawParallaxBackground();

  // Cursor logic
  if (!gameStarted || gameOver) {
    cursor();
  } else {
    noCursor();
  }

  // Music switching
  if (!gameStarted) {
    if (musicState.home && !musicState.home.isPlaying()) playMusic(musicState.home);
    gameOverSoundPlayed = false;
    gameOverSoundStopTimer = 0;
    drawOpeningScreen();
    return;
  } else if (gameOver) {
    if (musicState.current !== musicState.over) playMusic(musicState.over);
    // Play game over sound only once, stop after 3 seconds
    if (!gameOverSoundPlayed && sounds.gameover && sounds.gameover.isLoaded()) {
      sounds.gameover.play();
      gameOverSoundPlayed = true;
      gameOverSoundStopTimer = millis();
    }
    if (gameOverSoundPlayed && sounds.gameover.isPlaying()) {
      if (millis() - gameOverSoundStopTimer > 3000) {
        sounds.gameover.stop();
      }
    }
    drawGameOver();
    drawBackToTitleBtn();
    drawCrosshair();
    return;
  } else {
    if (musicState.current !== musicState.game) playMusic(musicState.game);
  }

  drawHUD();

  if (gameOver) {
    drawGameOver();
    drawBackToTitleBtn();
    drawCrosshair();
    return;
  }

  const t = millis();
  const elapsed = t / 1000;
  const spawnInterval = max(MIN_SPAWN_MS, BASE_SPAWN_MS - floor(elapsed / 15) * 100);
  if (enemies.length < MAX_ENEMIES && t - lastSpawn > spawnInterval) {
    spawnEnemy();
    lastSpawn = t;
  }

  // Update reloads
  for (const k in GUNS) {
    const ws = weaponState[k];
    if (ws.reloading && t >= ws.reloadEndsAt) {
      ws.ammo = GUNS[k].clip;
      ws.reloading = false;
    }
  }

  for (let i = enemies.length - 1; i >= 0; i--) {
    const e = enemies[i];
    e.x += e.vx;
    e.y += e.vy;

    // Bounce only at sides and top
    if (!e.bounced) {
      if (e.x < e.r || e.x > width - e.r) {
        e.vx *= -1;
        e.bounced = true;
      }
      if (e.y < e.r) { 
        e.vy *= -1;
        e.bounced = true;
      }
    }

    // Animate and draw enemy sprite or boss circle
    if (e.kind === "small" || e.kind === "medium" || e.kind === "tanky") {
      let animType = (e.hp > 0 && !e.dying) ? "idle" : "die";
      let sheet = enemySpriteSheets[e.kind][animType];
      let frameTotal = ENEMY_ANIMS[e.kind][animType];

      // Advance animation frame
      if (!e.anim) {
        e.anim = animType;
        e.frame = 0;
        e.frameTick = 0;
      }
      if (e.anim !== animType) {
        e.anim = animType;
        e.frame = 0;
        e.frameTick = 0;
      }
      let animSpeed = animType === "idle" ? 6 : 3;
      e.frameTick = (e.frameTick || 0) + 1;
      if (e.frameTick >= animSpeed) {
        e.frameTick = 0;
        if (animType === "idle") {
          e.frame = (e.frame + 1) % frameTotal;
        } else {
          if (e.frame < frameTotal - 1) e.frame++;
        }
      }
      if (sheet) {
        drawSpriteFrame(sheet, frameTotal, e.frame, e.x, e.y, e.r * 2, e.r * 2);
      }
    } else if (e.kind === "boss") {
      // Boss: use random enemy sprite, 2x size, reddish tint
      let bossKind = e.bossSpriteKind || "small";
      let animType = (e.hp > 0 && !e.dying) ? "idle" : "die";
      let sheet = enemySpriteSheets[bossKind][animType];
      let frameTotal = ENEMY_ANIMS[bossKind][animType];
      if (!e.anim) {
        e.anim = animType;
        e.frame = 0;
        e.frameTick = 0;
      }
      if (e.anim !== animType) {
        e.anim = animType;
        e.frame = 0;
        e.frameTick = 0;
      }
      let animSpeed = animType === "idle" ? 6 : 3;
      e.frameTick = (e.frameTick || 0) + 1;
      if (e.frameTick >= animSpeed) {
        e.frameTick = 0;
        if (animType === "idle") {
          e.frame = (e.frame + 1) % frameTotal;
        } else {
          if (e.frame < frameTotal - 1) e.frame++;
        }
      }
      if (sheet) {
        push();
        // Tint with reddish hue
        tint(e.color);
        drawSpriteFrame(sheet, frameTotal, e.frame, e.x, e.y, e.r * 2, e.r * 2);
        noTint();
        pop();
      } else {
        // fallback: big reddish circle
        noStroke();
        fill(e.color);
        circle(e.x, e.y, e.r * 2);
      }
    } else {
      noStroke();
      fill(e.color);
      circle(e.x, e.y, e.r * 2);
    }

    drawHpTicks(e);

    // Remove enemy only after deathTimer expires
    if (e.hp <= 0 && !e.dying) {
      e.dying = true;
      e.deathTimer = 30; // ~0.5 seconds at 60fps
    }
    if (e.dying) {
      e.deathTimer--;
      if (e.deathTimer <= 0) {
        enemies.splice(i, 1);
        continue;
      }
    } else if (
      e.x < -e.r - 50 || e.x > width + e.r + 50 ||
      e.y < -e.r - 50 || e.y > height + e.r + 50
    ) {
      if (e.hp > 0) {
        escaped++;
        if (escaped >= 5) gameOver = true;
      }
      enemies.splice(i, 1);
    }
  }

  drawCrosshair();
}

function drawOpeningScreen() {
  // Draw border
  stroke(255);
  strokeWeight(6);
  noFill();
  rect(12, 12, width - 24, height - 24, 24); // keep big border radius
  noStroke();

  // Draw semi-transparent panel for title/button
  fill(30, 40, 60, 220);
  rect(width/2 - 240, height/2 - 120, 480, 220, 32);

  // Title
  fill(255);
  textFont(pixelFont);
  textAlign(CENTER, CENTER);
  textSize(64);
  text("Sky Hunt", width/2, height/2 - 60);

  // Button
  startBtn.x = width/2 - startBtn.w/2;
  startBtn.y = height/2 + 20;
  fill("#4CAF50"); // new green color
  rect(startBtn.x, startBtn.y, startBtn.w, startBtn.h, 8); // less rounded
  stroke(255);
  strokeWeight(3);
  noFill();
  rect(startBtn.x, startBtn.y, startBtn.w, startBtn.h, 8); // less rounded
  noStroke();

  fill(255);
  textSize(32);
  textAlign(CENTER, CENTER);
  text("Start", width/2, startBtn.y + startBtn.h/2 - 4); // move up slightly

  textAlign(LEFT, BASELINE);
}

function drawBackToTitleBtn() {
  backBtn.x = width/2 - backBtn.w/2;
  backBtn.y = height/2 + 80;
  fill("#4CAF50"); // new green color
  rect(backBtn.x, backBtn.y, backBtn.w, backBtn.h, 8); // less rounded
  stroke(255);
  strokeWeight(3);
  noFill();
  rect(backBtn.x, backBtn.y, backBtn.w, backBtn.h, 8); // less rounded
  noStroke();

  fill(255);
  textFont(pixelFont);
  textSize(28);
  textAlign(CENTER, CENTER);
  text("Back to Title", width/2, backBtn.y + backBtn.h/2 - 3); // move up slightly
  textAlign(LEFT, BASELINE);
}

function mousePressed() {
  if (!gameStarted) {
    // Check if click is inside button
    if (
      mouseX >= startBtn.x && mouseX <= startBtn.x + startBtn.w &&
      mouseY >= startBtn.y && mouseY <= startBtn.y + startBtn.h
    ) {
      gameStarted = true;
    }
    return;
  }
  if (gameOver) {
    // Check if click is inside "Back to Title" button
    if (
      mouseX >= backBtn.x && mouseX <= backBtn.x + backBtn.w &&
      mouseY >= backBtn.y && mouseY <= backBtn.y + backBtn.h
    ) {
      gameStarted = false;
      resetGame();
      return;
    }
    return;
  }
  shoot(mouseX, mouseY);
}

function keyPressed() {
  if (key === '1') gunKey = "handgun";
  if (key === '2') gunKey = "shotgun";
  if (key === '3') gunKey = "sniper";
  if (key === 'R' || key === 'r') startReload(gunKey);
  if (gameOver && keyCode === ENTER) resetGame();
}

function startReload(k) {
  const g = GUNS[k];
  const ws = weaponState[k];
  if (ws.reloading) return;
  if (ws.ammo === g.clip) return;
  ws.reloading = true;
  ws.reloadEndsAt = millis() + g.reloadMs;
}

function getHitsOverlap(mx, my, crosshairR) {
  const res = [];
  for (let i = 0; i < enemies.length; i++) {
    const e = enemies[i];
    const dx = mx - e.x;
    const dy = my - e.y;
    const dist2 = dx*dx + dy*dy;
    const sumR = crosshairR + e.r;
    if (dist2 <= sumR * sumR) res.push(i);
  }
  return res;
}

function shoot(mx, my) {
  const g = GUNS[gunKey];
  const ws = weaponState[gunKey];
  if (ws.reloading) return;
  if (ws.ammo <= 0) { startReload(gunKey); return; }
  ws.ammo--;

  // Play weapon sound
  if (gunKey === "handgun") sounds.handgun.play();
  if (gunKey === "shotgun") sounds.shotgun.play();
  if (gunKey === "sniper") sounds.sniper.play();

  const hits = getHitsOverlap(mx, my, g.radius);
  let killsThisShot = 0;
  let killed = [];
  for (const i of hits) {
    let e = enemies[i];
    if (e.hp > 0) {
      e.hp -= g.dmg;
      if (e.hp <= 0 && !e.dying) {
        score += e.score;
        killsThisShot++;
        totalKills++;
        killsSinceBoss++;
        killed.push(e);
        while (killsSinceBoss >= 12) {
          spawnBoss();
          killsSinceBoss -= 12;
        }
        if (score > highScore) {
          highScore = score;
          localStorage.setItem("highscore", highScore);
        }
      }
    }
  }
  // Play kill sound for each kill (random kill1/kill2) with delay
  if (killed.length > 0) {
    let now = millis();
    if (now - lastKillSoundTime > 120) { // 120ms delay between kill sounds
      let snd = random([sounds.kill1, sounds.kill2]);
      snd.play();
      lastKillSoundTime = now;
    }
  }

  if (ws.ammo === 0) startReload(gunKey);
}

function spawnEnemy() {
  const x0 = random(40, width - 40);
  const y0 = height - 60;
  const p = random();
  // Increase r for bigger enemies (multiply by 1.7)
  if (p < 0.45) {
    enemies.push(makeEnemy("small", x0, y0, 1, 1.8, 35, color(255, 240, 120)));
  } else if (p < 0.8) {
    enemies.push(makeEnemy("medium", x0, y0, 2, 1.5, 40, color(120, 230, 255)));
  } else {
    enemies.push(makeEnemy("tanky", x0, y0, 3, 1.2, 50, color(200, 120, 255)));
  }
}

function spawnBoss() {
  const x0 = random(80, width - 80);
  const y0 = height - 60;
  // Boss is 2x bigger and reddish
  const bossR = 60; // was 30
  const bossColor = color(255, random(40,80), random(40,80)); // reddish hue
  // Pick a random enemy kind for boss sprite
  const bossKinds = ["small", "medium", "tanky"];
  const bossKind = random(bossKinds);
  const e = makeEnemy("boss", x0, y0, 7, 1.3, bossR, bossColor);
  e.score = 5;
  e.bossSpriteKind = bossKind;
  enemies.push(e);
  if (sounds.bossEnter) sounds.bossEnter.play();
}

function makeEnemy(kind, x, y, hp, baseSpeed, r, c) {
  const side = random() < 0.5 ? -1 : 1;
  const angle = radians(random(60, 120)) * side;
  const spd = baseSpeed * random(1.2, 1.6);
  const vx = spd * cos(angle);
  const vy = -abs(spd * sin(angle));

  return {
    kind, x, y, vx, vy,
    hp, maxHp: hp,
    r, color: c,
    score: 1,
    bounced: false,
    anim: "idle",
    frame: 0,
    frameTick: 0,
    dying: false,
    deathTimer: 0
  };
}

function drawHUD() {
  fill(255);
  textSize(16);
  text(`Score ${score}`, 12, 22);
  text(`High ${highScore}`, 12, 42);
  text(`Escaped ${escaped}/5`, 12, 62);
  text(`Kills ${totalKills}`, 12, 82);

  // Weapon status bars
  let yBase = 120;
  for (const k of ["handgun","shotgun","sniper"]) {
    const g = GUNS[k];
    const ws = weaponState[k];

    // Label + ammo
    fill(k === gunKey ? "yellow" : 255);
    text(`${g.name} (${ws.ammo}/${g.clip})`, 12, yBase);

    // Reload bar
    let barW = 120, barH = 8;
    let pct = 1;
    if (ws.reloading) {
      const remain = ws.reloadEndsAt - millis();
      pct = constrain(1 - remain / g.reloadMs, 0, 1);
    }
    noStroke();
    fill(200,0,0);
    rect(12, yBase + 6, barW, barH);
    fill(0,200,0);
    rect(12, yBase + 6, barW * pct, barH);

    yBase += 30;
  }
}

function drawHpTicks(e) {
  const gap = 6;
  const w = (e.maxHp - 1) * gap;
  const y = e.y - e.r - 10;
  const x0 = e.x - w / 2;
  stroke(255);
  strokeWeight(2);
  for (let i = 0; i < e.maxHp; i++) {
    const x = x0 + i * gap;
    if (i < e.hp) line(x, y, x, y - 6);
    else {
      stroke(200, 200, 200, 140);
      line(x, y, x, y - 6);
      stroke(255);
    }
  }
  noStroke();
}

function drawCrosshair() {
  const r = GUNS[gunKey].radius;
  noFill();
  stroke(255);
  circle(mouseX, mouseY, r * 2);
  line(mouseX - 7, mouseY, mouseX + 7, mouseY);
  line(mouseX, mouseY - 7, mouseX, mouseY + 7);
  noStroke();
}

function drawGameOver() {
  fill(0, 180);
  rect(0, 0, width, height); // keep box covering everything
  fill(255);
  textFont(pixelFont);
  textSize(48);
  textAlign(LEFT, BASELINE);
  // Move all text up by 60px
  text("Game Over", width / 2 - 110, height / 2 - 80);
  textSize(18);
  text(`Score ${score}                   High ${highScore}`, width / 2 - 100, height / 2);
  text("Press Enter to restart", width / 2 - 110, height / 2 + 28);
}

function resetGame() {
  enemies = [];
  score = 0;
  totalKills = 0;
  killsSinceBoss = 0;
  escaped = 0;
  gameOver = false;
  gunKey = "handgun";
  gameOverSoundPlayed = false;
  gameOverSoundStopTimer = 0;
  for (const k in GUNS) {
    weaponState[k].ammo = GUNS[k].clip;
    weaponState[k].reloading = false;
    weaponState[k].reloadEndsAt = 0;
  }
  lastSpawn = 0;
}

// Parallax background drawing
function drawParallaxBackground() {
  // Parallax speeds for each layer (lower index = slower)
  const speeds = [0.2, 0.4, 0.7, 1.1, 1.7, 2.3, 3.2];
  for (let i = 0; i < parallaxImgs.length; i++) {
    parallaxOffsets[i] -= speeds[i];
    if (parallaxOffsets[i] < -width) parallaxOffsets[i] += width;
    image(parallaxImgs[i], parallaxOffsets[i], 0, width, height);
    image(parallaxImgs[i], parallaxOffsets[i] + width, 0, width, height);
  }
}