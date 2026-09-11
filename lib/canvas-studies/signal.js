// Adapted from supplied coursework: HTMLCanvas/canvas.js
export default function createStudy({ window, document, requestAnimationFrame }) {
/*
ideas for movies/tv inspired canvas drawing

  * the center could be the screen no invalid channel error 
        *when animated maybe i can make a glitch effect by changing the color slightly
  * can add unanimamted particles for now just squares within the border of the lines that are the same color as the bars
        *add adding a particle system of particles the same color of the bars
  * maybe a black border/box behind the screen to separate layers
  * the background/sides could be maybe a gradient
  * can also add buttons on the border that resemeble the real life tv
  * the background can be gray scale of the colors randomly picked or just really dark
    * the position of the static can be randomized on refresh as well 


*/


const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

const image = document.querySelector('img');


let width;
let height;

// set the number of canvas, scaled for screen resolution
let pxScale = window.devicePixelRatio;
const imgScale = 40;

let colors = [];
let colors2D = [];

function setup() {
    // full canvas size
    width = window.innerWidth;
    height = window.innerHeight;

    // set the CSS display size
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    canvas.width = Math.floor(width * pxScale);
    canvas.height = Math.floor(height * pxScale);

    // normalize the coordinate system
    context.scale(pxScale, pxScale);

    if (width >= height) {
        context.drawImage(image, 0, 0, width / imgScale, width / imgScale);
    } else {
        context.drawImage(image, 0, 0, height / imgScale, height / imgScale);
    }

    //sample img cropper, while accounting for ixel density
    let imageData = context.getImageData(0, 0, canvas.width / imgScale, canvas.height / imgScale);
    let data = imageData.data;

    for (let y = 0; y < imageData.height; y++) {
        for (let x = 0; x < imageData.width; x++) {
            let index = (x + y * imageData.width) * 4; //index pos of every pixel

            let r = data[index];
            let g = data[index + 1];
            let b = data[index + 2];
            let a = data[index + 3];

            colors.push(`rgba(${r},${g}, ${b}, 1)`);
            colors2D.push([r, g, b, a]);
        }
    }

    
}

function draw() {

    context.moveTo(50,50)
    context.clearRect(0, 0, width, height);

    context.fillStyle = 'rgb(194, 194, 194)';
    context.fillRect(0, 0, width, height);

    context.strokeStyle = "black";
    

    //static background

    let staticColors = [];
    for (let i = 0; i< 3; i++){
        staticColors.push(colors2D[Math.floor(Math.random()*colors.length)]);
    }
    for (let i = 0; i < 20000; i++) {
        let x = Math.random() * width;
        let y = Math.random() * height;

        let r = staticColors[Math.floor(Math.random() * staticColors.length)][0];
        let g = staticColors[Math.floor(Math.random() * staticColors.length)][1];
        let b = staticColors[Math.floor(Math.random() * staticColors.length)][2];

        context.fillStyle = `rgba(${r}, ${r}, ${r}, .5)`;
        context.fillRect(x, y, (Math.random()*25) +3 ,(Math.random()*10)+2);
    }

    context.save();
    context.translate(width / 2, height / 2);

    //tv
    context.fillStyle = 'black';
    context.fillRect(-400, -200, 800, 400);

    //tv screen
    context.fillStyle = 'rgb(255, 0, 255)';
    context.fillRect(-375, -175, 750, 350);

    context.restore();


    //bars
    let numBars =11;
    let barColors = [];
    for (let i = 0; i < numBars; i++) {
        let barColor = colors2D[Math.floor(Math.random() * colors.length)];
        let r = barColor[0];
        let g = barColor[1];
        let b = barColor[2];
        context.fillStyle = `rgba(${r}, ${g}, ${b}, 1)`;
        let barWidth = 750/numBars;
        context.fillRect(width/2 -375 + i*barWidth, height/2-175, barWidth, 350);

        barColors.push(barColor);
    }

    //color static between bars at right edge
    for (let i =0; i<numBars-1; i++){
        for (let j = 0; j < 50; j++) {
            let barWidth = 750 / numBars;
            let barStaticColor = barColors[i]; 
            context.fillStyle = `rgba(${barStaticColor[0]-10}, ${barStaticColor[1]-10}, ${barStaticColor[2]-10}, .5)`;
            let staticX = width/2 - 386 + (i + 1) * barWidth + Math.random() * 10;
            let staticY = height/2 - 175 + Math.random() * 320;
            context.fillRect(staticX, staticY, (Math.random() * 15) + 2, (Math.random() * 5) + 2);

        }
    } 

    //small mid bars
    for (let i=0; i<numBars;i++){
        let barColor = colors[Math.floor(Math.random() * colors.length)];
        context.fillStyle = barColor;
        let barWidth = 750/numBars;
        context.fillRect(width/2 -375 + i*barWidth, height/2-175 +235, barWidth, 50);
    }

    //medium low bars
    numBars = 8;
    for (let i=0; i<numBars;i++){
        let barColor = colors[Math.floor(Math.random() * colors.length)];
        context.fillStyle = barColor;
        let barWidth = 750/numBars;
        context.fillRect(width/2 -375 + i*barWidth, height/2-175 +270, barWidth, 80);
    }

    //tv legs
    context.fillStyle = 'black';
    context.fillRect(width/2 -350, height/2+200, 50, 50);
    context.fillRect(width/2 +300, height/2+200, 50, 50);


    

}

// wait for the DOM to load, including dependent resources
window.addEventListener('load', () => {
    setup();
    draw();
});

window.addEventListener('resize', () => {
    setup();
    draw();
});
}
