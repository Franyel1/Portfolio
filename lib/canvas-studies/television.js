// Adapted from supplied coursework: HTMLCanvasObjects/canvas.js
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

let numBars;
let barColors = [], midBarColors = [], lowBarColors = [];
let staticColors = [];

let BWstatic= [];

let tvStatic = [];
let tvStaticMoves = [];

let midBars = [];
let lowBars = [];

// set the expected frame rate
let fps = 60; // frames per second (60 is a good standard)
let previousTime = performance.now(); // time since navigating page

let frameInterval = Math.floor(1000 / fps); // milliseconds between frames
let deltaTimeMultiplier = 1; // initialize multiplier value
// amount of time between animation function calls
let deltaTime = 0;

function setup() {
    //clear all arrays
    colors = [];
    colors2D = [];

    staticColors = [];

    BWstatic = [];

    tvStatic = [];
    tvStaticMoves = [];

    midBars = [];
    lowBars = [];

    barColors = [];
    midBarColors = [];
    lowBarColors = [];
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

    //static
    staticColors = [];
    for (let i = 0; i < 3; i++) {
        staticColors.push(colors2D[Math.floor(Math.random() * colors.length)]);

    }

    for (let i = 0; i < 1000; i++) {
        let x = Math.random() * width;
        let y = Math.random() * height;

        let r = staticColors[Math.floor(Math.random() * staticColors.length)][0];
        let g = staticColors[Math.floor(Math.random() * staticColors.length)][1];
        let b = staticColors[Math.floor(Math.random() * staticColors.length)][2];

        //context.fillStyle = `rgba(${r}, ${r}, ${r}, .5)`;
        //context.fillRect(x, y, (Math.random() * 25) + 3, (Math.random() * 10) + 2);

        BWstatic.push(new StaticParticle(x, y, [r, g, b]));
    }

    //bars
    numBars = 11;
    barColors = [];
    for (let i = 0; i < numBars; i++) {
        let barColor = colors2D[Math.floor(Math.random() * colors.length)];
        let r = barColor[0];
        let g = barColor[1];
        let b = barColor[2];

        barColors.push(barColor);
    }


    //small mid bars colors
    numBars = 8;
    for (let i = 0; i < numBars; i++) {
        let barColor = colors2D[Math.floor(Math.random() * colors.length)];
        context.fillStyle = barColor;
        midBarColors.push(barColor);

        midBars.push(new Bar(width / 2 - 375 + i * (750 / numBars), height / 2 - 175 + 235, 750 / numBars, 50, barColor));


    }   


    //medium low bars colors
    numBars = 7;
    for (let i = 0; i < numBars; i++) {
        let barColor = colors2D[Math.floor(Math.random() * colors.length)];
        lowBarColors.push(barColor);

        lowBars.push(new Bar(width / 2 - 375 + i * (750 / numBars), height / 2 - 175 + 270, 750 / numBars, 80, barColor));
    }


    numBars = 8;

    //color static between bars at right edge
    for (let i = 0; i < numBars - 1; i++) {
        for (let j = 0; j < 20; j++) {
            let barWidth = 750 / numBars;
            let barStaticColor = barColors[i];
            context.fillStyle = `rgba(${barStaticColor[0] - 10}, ${barStaticColor[1] - 10}, ${barStaticColor[2] - 10}, .5)`;
            let staticX = width / 2 - 386 + (i + 1) * barWidth + Math.random() * 10;
            let staticY = height / 2 - 175 + Math.random() * 220;
            // context.fillRect(staticX, staticY, (Math.random() * 15) + 2, (Math.random() * 5) + 2);

           tvStatic.push(new TVStaticParticle(staticX, staticY, [barStaticColor[0] - 10, barStaticColor[1] - 10, barStaticColor[2] - 10]));


        }
    }

    //color static between bars at left edge
    for (let i = 1; i < numBars - 1; i++) {
        for (let j = 0; j < 20; j++) {
            let barWidth = 750 / numBars;
            let barStaticColor = barColors[i];
            context.fillStyle = `rgba(${barStaticColor[0] - 10}, ${barStaticColor[1] - 10}, ${barStaticColor[2] - 10}, .5)`;
            let staticX = width / 2 - 386 + i * barWidth + Math.random() * 10;
            let staticY = height / 2 - 175 + Math.random() * 220;
            // context.fillRect(staticX, staticY, (Math.random() * 15) + 2, (Math.random() * 5) + 2);

            tvStatic.push(new TVStaticParticle(staticX, staticY, [barStaticColor[0] - 10, barStaticColor[1] - 10, barStaticColor[2] - 10]));
        }
    }

    for (let i = 1; i < numBars - 1; i++) {
        for (let j = 0; j < 20; j++) {
            let barWidth = 750 / numBars;
            let barStaticColor = barColors[i];
            context.fillStyle = `rgba(${barStaticColor[0] - 10}, ${barStaticColor[1] - 10}, ${barStaticColor[2] - 10}, .5)`;
            let staticX = width / 2 - 386 + i * barWidth + Math.random() * 10;
            let staticY = height / 2 - 175 + Math.random() * 220;
            // context.fillRect(staticX, staticY, (Math.random() * 15) + 2, (Math.random() * 5) + 2);

            tvStaticMoves.push(new TVStaticParticle(staticX, staticY, [barStaticColor[0] - 10, barStaticColor[1] - 10, barStaticColor[2] - 10]));
        }
    }


    
}

function draw(currentTime = performance.now()) {
    // time between function calls
    deltaTime = currentTime - previousTime;
    // like devicePixelRatio for screen refresh rate
    deltaTimeMultiplier = deltaTime / frameInterval;
    // take time stamp
    previousTime = currentTime;

    context.moveTo(50,50)
    context.clearRect(0, 0, width, height);

    context.fillStyle = 'rgb(194, 194, 194)';
    context.fillRect(0, 0, width, height);

    context.strokeStyle = "black";
    

    //static background
    for (let i = 0; i < BWstatic.length; i++) {
        BWstatic[i].display();
        BWstatic[i].moveSmoothly();
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



    numBars = 8
    //big bars
    for (let i = 0; i < numBars; i++) {
        let barWidth = 750 / numBars;
        context.fillStyle = `rgba(${barColors[i][0]}, ${barColors[i][1]}, ${barColors[i][2]}, 1)`;
        context.fillRect(width / 2 - 375 + i * barWidth, height / 2 - 175, barWidth, 350);

    }


    //small mid bars colors
    numBars = 8;
    // for (let i = 0; i < numBars; i++) {
    //     context.fillStyle =  midBarColors[i];
    //     let barWidth = 750 / numBars;
    //     context.fillRect(width / 2 - 375 + i * barWidth, height / 2 - 175 + 235, barWidth, 50);
    // }
    for (let i = 0; i < midBars.length; i++) {
        midBars[i].colorShift();
        context.fillStyle = midBars[i].color2;
        context.fillRect(midBars[i].x, midBars[i].y, midBars[i].w, midBars[i].h);
    }

    

    numBars = 7;
    //medium low bars colors
    // for (let i = 0; i < numBars; i++) {
    //     context.fillStyle = lowBarColors[i];
    //     let barWidth = 750 / numBars;
    //     context.fillRect(width / 2 - 375 + i * barWidth, height / 2 - 175 + 270, barWidth, 80);
    // }

    for (let i = 0; i < lowBars.length; i++) {
        lowBars[i].colorShift();
        context.fillStyle = lowBars[i].color2;
        context.fillRect(lowBars[i].x, lowBars[i].y, lowBars[i].w, lowBars[i].h);
    }

    //tv static
    for (let i = 0; i < tvStatic.length; i++) {
        tvStatic[i].display();
        tvStatic[i].move();
    }
    for (let i = 0; i < tvStaticMoves.length; i++) {
        tvStaticMoves[i].display();
        tvStaticMoves[i].moveNoBounds();
    }



    //tv legs
    context.fillStyle = 'black';
    context.fillRect(width/2 -350, height/2+200, 50, 50);
    context.fillRect(width/2 +300, height/2+200, 50, 50);


    requestAnimationFrame(draw);

}

class StaticParticle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.w = (Math.random() * 100) + 20;
        this.h = (Math.random() * 50) + 20;
        this.speedX = (Math.random() - 0.5) * 5;
        this.speedY = (Math.random() - 0.5) * 5;
    }

    display(){
        context.fillStyle = `rgba(${this.color[0]}, ${this.color[1]}, ${this.color[2]}, .3)`;
        context.fillRect(this.x, this.y, this.w, this.h);
    }
    moveSmoothly() {
        this.x += this.speedX;
        this.y += this.speedY;

        // bounce off edges
        if (this.x < -50 || this.x > width) {
            this.speedX *= -1;
        }
        if (this.y < -50 || this.y > height) {
            this.speedY *= -1;
        }
    }
    move(){
        this.x += (Math.random() - 0.5) * 10 * deltaTimeMultiplier;
        this.y += (Math.random() - 0.5) * 10 * deltaTimeMultiplier;
    }

}

class TVStaticParticle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.originalX = x;
        this.originalY = y;
        this.color = color;
        this.w = (Math.random() * 25) + 2;
        this.h = (Math.random() * 15) + 2;
        this.maxMoveY = 5;
        this.maxMoveX= 10;
        this.speedX = (Math.random() - 0.5) * 2;
        this.speedY = (Math.random() - 0.5) * 2;
    }

    display(){
        context.fillStyle = `rgba(${this.color[0]}, ${this.color[1]}, ${this.color[2]}, .5)`;
        context.fillRect(this.x, this.y, this.w, this.h);
    }

    move() {
        this.x = this.originalX + (Math.random() - 0.5) * this.maxMoveX * deltaTimeMultiplier;
        this.y = this.originalY + (Math.random() - 0.5) * this.maxMoveY * deltaTimeMultiplier;
    }

    moveNoBounds(){

        this.x += this.speedX;
        this.y += this.speedY;
    }

}

class Bar {
    constructor(x, y, w, h, color) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.color = color;
        this.color2 = `rgba(${color[0]}, ${color[1]}, ${color[2]}, 1)`;;
    }

    colorShift() {
        this.color[0] += (Math.random() - 0.5) * 10;
        this.color[1] += (Math.random() - 0.5) * 10;
        this.color[2] += (Math.random() - 0.5) * 10;
        // keep colors within bounds
        this.color[0] = Math.max(0, Math.min(255, this.color[0]));
        this.color[1] = Math.max(0, Math.min(255, this.color[1]));
        this.color[2] = Math.max(0, Math.min(255, this.color[2]));

        this.color2 = `rgba(${this.color[0]}, ${this.color[1]}, ${this.color[2]}, 1)`;
    }
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
