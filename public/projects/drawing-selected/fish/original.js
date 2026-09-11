const video = document.querySelector('video');

const canvas1 = document.getElementById('c1');
const context1 = canvas1.getContext('2d');

const canvas2 = document.getElementById('c2');
const context2 = canvas2.getContext('2d');

let width, height;
let pxScale = window.devicePixelRatio;

let imgScale = 10;
let scaleFactor = imgScale * pxScale;



function setup() {
  video.play();

  // fixed canvas size
  width = canvas1.width;
  height = canvas1.height;

  // set the CSS display size
  canvas1.style.width = width + 'px';
  canvas1.style.height = height + 'px';

  // set the number of display pixels, scaled for device resolution
  canvas1.width = width * pxScale;
  canvas1.height = height * pxScale;

  // normalize the coordinate system
  context1.scale(pxScale, pxScale);

  // set the CSS display size
  canvas2.style.width = width + 'px';
  canvas2.style.height = height + 'px';

  // set the number of display pixels, scaled for device resolution
  canvas2.width = width * pxScale;
  canvas2.height = height * pxScale;

  // normalize the coordinate system
  context2.scale(pxScale, pxScale);
}

//set an expected frame rate
let fps = 60; 
let previousTime = performance.now();

//num of millisecond between function calls
let frameInterval = Math.floor(1000/fps);
let deltaTimeMultiplier = 1;

let deltaTime = 0;


let raindrops = [];

let once = false;

function draw1(currentTime) {
  deltaTime = currentTime - previousTime;
  deltaTimeMultiplier = deltaTime/frameInterval;

  if (!once){
    for (let i = 0; i < 150; i++) {
      raindrops.push({
        x: Math.random() *width,
        y: Math.random() *height,
        speed: 2+ Math.random()* 3 * deltaTimeMultiplier,
        width: 2,
        height: 25 + Math.random() *15
      });
    }
    once = true;
  }
  //backgorund
  context1.fillStyle = 'rgb(100, 110, 130)';
  context1.fillRect(0, 0, width, height);

  for (let drop of raindrops) {
    context1.fillStyle = `rgba(150, 180, 255, 1)`;
    context1.fillRect(drop.x, drop.y, drop.width, drop.height);
    drop.y += drop.speed * deltaTimeMultiplier;

    if (drop.y > height) {
      drop.y = -drop.height ;
      drop.x = Math.random() * width;
    }
  }
  //////////clouds//////////////////
  context1.fillStyle = 'rgb(70, 70, 70)';
  context1.beginPath();
  context1.arc(200, 40, 50, 0, Math.PI*2);
  context1.arc(410, 35, 60, 0, Math.PI*2);
  context1.fill();
  
  context1.fillStyle = 'rgb(30, 30, 30)';
  context1.beginPath();
  context1.arc(20, 40, 50, 0, Math.PI*2);
  context1.arc(80, 35, 60, 0, Math.PI*2);
  context1.arc(150, 40, 45, 0, Math.PI*2);
  context1.fill();

  context1.fillStyle = 'rgb(90, 90, 90)';
  context1.beginPath();
  context1.arc(250, 40, 65, 0, Math.PI*2);
  context1.arc(300, 35, 75, 0, Math.PI*2);
  context1.arc(360, 40, 65, 0, Math.PI*2);
  context1.fill();

  context1.fillStyle = 'rgb(60, 60, 60)';
  context1.beginPath();
  context1.arc(470, 40, 45, 0, Math.PI*2);
  context1.arc(520, 35, 55, 0, Math.PI*2);
  context1.arc(580, 40, 45, 0, Math.PI*2);
  context1.fill();
  
  previousTime = currentTime;

  requestAnimationFrame(draw1);
}

///////////////////drawing2////////////////////////////
let ripples = [];

function draw2() {
  context2.save();
  context2.globalAlpha = 0.03;
  context2.drawImage(video, 0, 0, width, height);

  context2.restore();
  context2.fillStyle = 'rgba(40, 45, 60, 0.25)';
  context2.fillRect(0, 0, width, height);

  for (let rip of ripples) {
    context2.beginPath();
    context2.arc(rip.x, rip.y, rip.radius, 0, Math.PI* 2);
    context2.strokeStyle = `rgba(${rip.r}, ${rip.g}, ${rip.b}, ${rip.a})`;
    context2.lineWidth = 2;
    context2.stroke();

    rip.radius += 1;
    rip.a *= 0.85;
  }

  ripChance = Math.random();

  if(ripChance <0.2){
    let x = Math.random() *width;
    let y = Math.random() *height;

    //had to make new canvas to have the video in and take the data from there
    const hidden = document.createElement('canvas'); 
    const hidContext = hidden.getContext('2d');
    hidden.width = width / imgScale;
    hidden.height = height / imgScale;

    hidContext.drawImage(video, 0, 0, hidden.width, hidden.height);
    let pixelData = hidContext.getImageData(0, 0, hidden.width, hidden.height).data;


    let px = Math.floor(x / imgScale);
    let py = Math.floor(y / imgScale);
    let index = (px + py * Math.floor(width/imgScale)) * 4;

    let r = pixelData[index];
    let g = pixelData[index + 1];
    let b = pixelData[index + 2];
    let a = pixelData[index + 3];

    ripples.push({ x, y, radius: 0, a, r, g, b });
  }

  requestAnimationFrame(draw2);
}

window.addEventListener('load', () => {
  setup();
  window.requestAnimationFrame(draw1);
  draw2();
});


