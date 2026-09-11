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
let frameInterval = Math.floor(1000 / fps);
let deltaTimeMultiplier = 1;

let deltaTime = 0;

let petals = [];

let once = false;

function draw1(currentTime) {
  deltaTime = currentTime - previousTime;
  deltaTimeMultiplier = deltaTime / frameInterval;

  //background
  //sky
  context1.fillStyle = 'lightblue';
  context1.fillRect(0, 0, width, height);

  //hills back
  context1.fillStyle = 'darkgreen';
  context1.beginPath();
  context1.moveTo(0, 300);
  context1.bezierCurveTo(width * 0.9, height * .7, width * 0.6, height * 0.4, width, height-100);
  context1.lineTo(width, height);
  context1.closePath();
  context1.fill();


  //hills bezier
  context1.fillStyle = 'green';
  context1.beginPath();
  context1.moveTo(0, 300);
  context1.bezierCurveTo(width * 0.4, height*.2, width * 0.5, height * 0.8, width, height);
  context1.lineTo(0,height);
  context1.closePath();
  context1.fill();

  //cherry blossom tree bezier
  context1.fillStyle = '#5b3a29';

  context1.beginPath();

  // bottom left
  context1.moveTo(150, 250);

  context1.bezierCurveTo(
    200, height - 420,
    230, height - 320,
    190, 250
  );

  context1.closePath();
  context1.fill();

  //leaf clusters

  context1.fillStyle = '#e1a2d2';
  context1.beginPath();
  context1.arc(240, 120, 30, 0, Math.PI * 2);
  context1.closePath();
  context1.fill();

  context1.fillStyle = '#e1a2d2';
  context1.beginPath();
  context1.arc(210, 130, 30, 0, Math.PI * 2);
  context1.closePath();
  context1.fill();

  context1.fillStyle = '#e1a2d2';
  context1.beginPath();
  context1.arc(160, 120, 35, 0, Math.PI * 2);
  context1.closePath();
  context1.fill();

  context1.fillStyle = '#d667ba';
  context1.beginPath();
  context1.arc(200, 70, 35, 0, Math.PI * 2);
  context1.closePath();
  context1.fill();

  context1.fillStyle = '#e086ca';
  context1.beginPath();
  context1.arc(170, 100, 35, 0, Math.PI * 2);
  context1.closePath();
  context1.fill();


  context1.fillStyle = '#e086ca';
  context1.beginPath();
  context1.arc(220, 100, 30, 0, Math.PI * 2);
  context1.closePath();
  context1.fill();

  //sun
  context1.fillStyle = '#f29946';
  context1.beginPath();
  context1.arc(500, 80, 45, 0, Math.PI * 2);
  context1.closePath();
  context1.fill();

  context1.fillStyle = '#f2d846';
  context1.beginPath();
  context1.arc(500, 80, 40, 0, Math.PI * 2);
  context1.closePath();
  context1.fill();

  //animate cherry blossom petals ovals flying to the right and spining slightly
  if (!once) {
    for (let i = 0; i < 10; i++) {
      petals.push({
        x: Math.random() * width,
        y: Math.random() * height * 0.6, 
        speedX: 1 + Math.random() * 1.5, 
        speedY: 0.5 + Math.random(), 
        size: 6 + Math.random() * 6,
        angle: Math.random() * Math.PI,
        spin: (Math.random() - 0.5) * 0.05
      });
    }
    once = true;
  }

  for (let p of petals) {
    context1.save();

    //move to petal position
    context1.translate(p.x, p.y);
    context1.rotate(p.angle);

    //petal ovals
    context1.fillStyle = '#ffc0cbda';
    context1.beginPath();
    context1.ellipse(0, 0, p.size, p.size * 0.6, 0, 0, Math.PI * 2);
    context1.fill();

    context1.restore();

    //movement
    p.x += p.speedX * deltaTimeMultiplier;
    p.y += p.speedY * deltaTimeMultiplier;

    //slight spin
    p.angle += p.spin * deltaTimeMultiplier;

    //reset when off screen
    if (p.x > width || p.y > height) {
      p.x = -10;
      p.y = Math.random() * height * 0.6;
    }
  }
  

  previousTime = currentTime;

  requestAnimationFrame(draw1);
}


let once2 = false;
let everyOther =false;
function draw2() {
  //context2.drawImage(video, 0, 0, width, height);
  
  //background
  context2.fillStyle = 'rgba(255, 192, 203, 0.5)';
  context2.fillRect(0, 0, width, height);

  //had to make new canvas to have the video in and take the data from there
  const hidden = document.createElement('canvas');
  const hidContext = hidden.getContext('2d');
  hidden.width = width / imgScale;
  hidden.height = height / imgScale;

  hidContext.drawImage(video, 0, 0, hidden.width, hidden.height);
  let pixelData = hidContext.getImageData(0, 0, hidden.width, hidden.height).data;

  //grid of squares random opacity
  if (!once2) {
    opacities = [];
    for (let i = 0; i <= 600; i++) {
      opacities.push(Math.random()*0.4+0.5);
    }
    once2 = true;
  }

  // let index = 0;
  // for (let y = 0; y < height; y += 20) {
  //   for (let x = 0; x < width; x += 20) {
  //     context2.fillStyle = `rgba(255, 192, 203, ${opacities[index]})`;
  //     context2.fillRect(x, y, 20, 20);
  //     index++;
  //   }
  // }

  //circles random opacity
  let index = 0;
  let j=0;
  for (let y = 10; y < height; y += 20) {
    for (let x = 10; x < width; x += 20) {
      j++;

      let pxX = Math.floor(x / imgScale);
      let pxY = Math.floor(y / imgScale);
      let px = (pxY * hidden.width + pxX) * 4;

      let r = pixelData[px];
      let g = pixelData[px + 1];
      let b = pixelData[px + 2];
      
      context2.lineWidth = 4;
      context2.strokeStyle = `rgba(255, 192, 203, ${opacities[index]})`;

      context2.stroke();

      context2.fillStyle = `rgba(${r+20}, ${g+20}, ${b+20}, ${opacities[index]})`;      context2.beginPath();
      context2.arc(x, y, 13.5 * opacities[j], 0, Math.PI * 2);
      context2.fill();
      index++;
    }
  }

  //plus or minus opacities for tinkle
  for (let i = 0; i < opacities.length; i++) {
    opacities[i] += (Math.random() - .5) * 0.1;
    opacities[i] = Math.max(0.5, Math.min(0.9, opacities[i]));
  }

  requestAnimationFrame(draw2);
    
}

window.addEventListener('load', () => {
  setup();
  window.requestAnimationFrame(draw1);
  draw2();
});