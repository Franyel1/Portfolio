// Adapted from supplied coursework: FinalProject/static/static.js
export default function createStudy({ window, document, requestAnimationFrame }) {
const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

let audioContext;
let toneHistory = [];


// set the expected frame rate
let fps = 60; // frames per second (60 is a good standard)
let previousTime = performance.now(); // time since navigating page


let w;
let h;

// set the number of canvas, scaled for screen resolution
let pxScale = window.devicePixelRatio;
const imgScale = 40;

let frameInterval = Math.floor(1000 / fps); // milliseconds between frames
let deltaTimeMultiplier = 1; // initialize multiplier value
// amount of time between animation function calls
let deltaTime = 0;


let gColor = [0,0,0];

let particles;

let mouseX = 0;
let mouseY = 0;
let mouseDown = false;

function setup(){
    particles =[];

    //set up the global color
    for (let i=0; i<3;i++){
        gColor[i] = Math.floor(Math.random()*105)+150;
    }
    

    // // full canvas size
    w = window.innerWidth;
    h = window.innerHeight;

    // set the CSS display size
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;

    canvas.width = Math.floor(w * pxScale);
    canvas.height = Math.floor(h * pxScale);

    // normalize the coordinate system
    context.setTransform(pxScale, 0, 0, pxScale, 0, 0);

    for (let i=0; i< 1400; i++){
        particles.push(new staticObject());
    }

}

function draw(currentTime = performance.now()){
    // time between function calls
    deltaTime = currentTime - previousTime;
    // like devicePixelRatio for screen refresh rate
    deltaTimeMultiplier = deltaTime / frameInterval;
    // take time stamp
    previousTime = currentTime;

    context.fillStyle = `rgb(${gColor[0] * .25},${gColor[1] * .25},${gColor[2] * .25})`;  
    context.fillRect(0,0, w,h);
    
    for (let i=0; i< particles.length;i++){
        particles[i].move();
        particles[i].draw();
    }


    requestAnimationFrame(draw);

}



function playTone(freq, duration = .5) {
// Sound intentionally disabled in the collage.
}

class staticObject{
    constructor() {
        this.x = Math.floor(Math.random() * w);
        this.y = Math.floor(Math.random() * h);

        this.ogX = this.x;
        this.ogY = this.y;

        this.c = [gColor[0], gColor[1], gColor[2]];
        this.w = (Math.floor(Math.random() * 25) + 10 );
        this.h = (Math.floor(Math.random() * 25) + 10 );
        this.c2 = Math.floor(Math.random() * 255);

        this.speedX = (Math.random() - 0.5) * 3;
        this.speedY = (Math.random() - 0.5) * 3;

        this.active = false;
        this.framesActive = 0;
        this.a = Math.random(); 
    }
    draw(){
        //two color styles depending if object is activated
        //context.fillStyle = `rgba(${this.c2},${this.c2},${this.c2}, ${Math.floor(Math.random()*255)/255})`;
        if (this.active) {
            context.fillStyle = `rgb(${this.c[0]},${this.c[1]},${this.c[2]})`;
        } else {
            context.fillStyle = `rgb(${this.c2},${this.c2},${this.c2})`;
            context.fillStyle = `rgba(${this.c2},${this.c2},${this.c2}, ${this.a})`;

        }
        context.fillRect(this.x, this.y, this.w, this.h);
    }
    move() {
        //maybe two movement types on if object is clicked and natural
        if (mouseDown) {
            let dx = mouseX - this.x;
            let dy = mouseY - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 50) {
                if (!this.active) {
                    const scale = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88];
                    let freq = scale[Math.floor(Math.random() * scale.length)];

                    this.freq = freq;
                    toneHistory.push(freq);

                    playTone(freq);
                }

                this.active = true;

                this.c[0] = gColor[0] + (Math.random() - 0.5) * 50;
                this.c[1] = gColor[1] + (Math.random() - 0.5) * 50;
                this.c[2] = gColor[2] + (Math.random() - 0.5) * 50;

                this.c[0] = Math.max(0, Math.min(255, this.c[0]));
                this.c[1] = Math.max(0, Math.min(255, this.c[1]));
                this.c[2] = Math.max(0, Math.min(255, this.c[2]));

                this.framesActive = 0;
            }
        }

        if (this.active) {
            this.x += this.speedX * deltaTimeMultiplier;
            this.y += this.speedY * deltaTimeMultiplier;

            if (this.x < 0 || this.x > w - this.w) {
                this.speedX *= -1;
            }

            if (this.y < 0 || this.y > h - this.h) {
                this.speedY *= -1;
            }

            this.c[0] += (Math.random() - 0.5) * 2;
            this.c[1] += (Math.random() - 0.5) * 2;
            this.c[2] += (Math.random() - 0.5) * 2;

            this.c[0] = Math.max(0, Math.min(255, this.c[0]));
            this.c[1] = Math.max(0, Math.min(255, this.c[1]));
            this.c[2] = Math.max(0, Math.min(255, this.c[2]));

            this.framesActive++;

            if (this.framesActive > 120) {
                this.active = false;
                this.framesActive = 0;

                if (toneHistory.length > 0) {
                    let reverseFreq = toneHistory.pop();
                    playTone(reverseFreq, 0.12);
                }
            }

            
        } else {
            this.x = this.ogX + (Math.random() - 0.5) * 8 * deltaTimeMultiplier;
            this.y = this.ogY + (Math.random() - 0.5) * 8 * deltaTimeMultiplier;
        }

        this.x = Math.max(0, Math.min(w - this.w, this.x));
        this.y = Math.max(0, Math.min(h - this.h, this.y));
    }
}


window.addEventListener('pointerdown', (event) => {
    mouseDown = true;
    mouseX = event.clientX;
    mouseY = event.clientY;
});

window.addEventListener('pointermove', (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
});

window.addEventListener('pointerup', () => {
    mouseDown = false;
});

// wait for the DOM to load, including dependent resources
window.addEventListener('load', () => {
    setup();
    requestAnimationFrame(draw);
});

window.addEventListener('resize', () => {
    setup();
});
}
