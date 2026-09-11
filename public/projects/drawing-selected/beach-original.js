const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

let width;
let height;

const image = document.querySelector('img');
const imgScale = 40;

// set the number of canvas, scaled for screen resolution
let pxScale = window.devicePixelRatio;

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
}


const colors = [];
let sandColor;
let waterColor;
let sunColor;
let skyColor;

// sample colors from raster graphic
function sampleColors() {
    context.drawImage(image, 0, 0, 45, 30);

    // sample image while accounting for pixel density
    let imageData = context.getImageData(0, 0, 45 * pxScale, 30  * pxScale);
    let data = imageData.data;

    context.clearRect(0, 0, width, height);  // clear canvas

    // organize all colors in an array of RGBA values
    for (let channel = 0; channel < data.length; channel += 4) {
        let color = `rgba(${data[channel]}, ${data[channel + 1]}, ${data[channel + 2]}, 1)`;
        colors.push(color);
    }
    waterColor = colors[Math.floor(Math.random() * colors.length)];
    sandColor = colors[Math.floor(Math.random() * colors.length)];
    sunColor = colors[Math.floor(Math.random() * colors.length)];
    skyColor = colors[Math.floor(Math.random() * colors.length)];


    

}

// set the expected frame rate
let fps = 60; // frames per second (60 is a good standard)
let previousTime = performance.now(); // time since navigating page

let frameInterval = Math.floor(1000 / fps); // milliseconds between frames
let deltaTimeMultiplier = 1; // initialize multiplier value
// amount of time between animation function calls
let delta_time = 0;

//maybe uhhhhhhhhhh
//make flowers rotate very slowly to not overwhelm
//make the water spiral rotate and fade out as it goes up?
//add black birds that are faintin the horizon that move randomly??




class Spiral {
    constructor(color) {
        this.xPos = Math.random() * width;
        this.yPos = this.yPos = height / 1.6 + Math.random() * (height / 3.5);
        this.size = 1 + Math.random() * 1.7; 
        this.color = color;
        this.moveSpeed = 1 + Math.random() * 1.7;
        this.fadeOut = 0.003;
        this.opacity = 1;

    }


    display() {
        context.save();
        context.translate(this.xPos, this.yPos);
        //context.rotate(this.rotation);
        context.globalAlpha = this.opacity;
        context.scale(this.size, this.size);

        const spiral = new Path2D("m 62.717983,72.429153 c -0.02543,0.494367 -0.678943,0.209621 -0.821669,-0.04227 -0.386779,-0.682609 0.259174,-1.43118 0.906209,-1.601069 1.157393,-0.303893 2.205905,0.672452 2.380468,1.770148 0.256178,1.610912 -1.088125,2.994703 -2.634087,3.159868 -2.060524,0.220139 -3.788962,-1.504226 -3.939267,-3.498026 -0.189145,-2.508994 1.920428,-4.585939 4.361965,-4.718668 2.957028,-0.160752 5.384468,2.336667 5.498067,5.225905 0.133872,3.404866 -2.752926,6.183969 -6.089844,6.277466 -3.852603,0.107946 -6.984119,-3.169197 -7.056866,-6.953782 -0.08266,-4.300287 3.585479,-7.784724 7.817722,-7.836266 2.299501,-0.028 4.542675,0.932037 6.140727,2.579875");
        context.strokeStyle =  this.color;
        context.stroke(spiral);

        context.restore();
    }
    move(increment) {
        this.yPos -= increment;

        this.opacity = Math.min(1, Math.max(0, (this.yPos - height / 2) / (height - height / 1.9)));
    
        if (this.yPos < height / 1.9) {
            this.yPos = height -50;
            this.xPos = Math.random() * width;
            this.opacity = 1;
        }
    }

}

class Flower {
    constructor(colors){
        this.xPos =Math.floor(Math.random() * width);
        this.yPos =  Math.floor(Math.random() * height/2);
        this.size =  0.2 +Math.random();
        this.flowerColor = colors[Math.floor(Math.random() * colors.length)];
        this.centerColor = colors[Math.floor(Math.random() * colors.length)];
        this.rotation = Math.floor(Math.random() * 360);
        this.speed = (Math.PI/180)*(Math.random() * 0.7) ;

    }

    display(){
        context.save();
        
        context.translate(this.xPos, this.yPos);
        context.rotate(this.rotation);
        context.scale(this.size, this.size);

        let cx = 65; 
        let cy = 108;
    
        let flower = new Path2D("m 76.948623,70.273145 c -7.42348,1.16898 -14.11407,8.667594 -14.01803,16.288004 0.0438,3.47437 3.60098,9.98431 -0.53815,12.41174 -4.10202,2.405671 -5.7316,-5.67904 -6.93388,-8.17841 -2.40836,-5.00666 -7.6324,-12.69932 -13.17036,-14.36119 -2.03084,-0.60943 -4.24104,-0.90956 -6.35,-0.60675 -2.39044,0.34322 -4.81788,1.11215 -6.87917,2.39166 -8.186572,5.08167 -5.065708,16.65643 0.0794,22.630251 3.27042,3.79717 8.36981,7.20561 13.41433,7.86114 1.79836,0.2337 3.5154,-0.19647 5.29167,-0.16598 1.48259,0.0255 3.50617,1.19163 3.36466,2.88837 -0.36431,4.36808 -7.05077,5.3296 -10.24383,6.2761 -6.24007,1.8497 -11.83675,3.28921 -16.664868,8.02182 -6.417977,6.291 -6.875819,17.30106 1.054454,22.64862 8.505934,5.73573 23.547764,1.76203 27.107134,-8.10695 1.3434,-3.72484 1.0689,-7.87286 2.54457,-11.64167 0.65985,-1.68523 2.14216,-3.61107 4.21088,-2.9984 1.43824,0.42594 1.96717,1.97242 2.37778,3.26298 1.04451,3.28298 0.14708,6.9542 -0.21314,10.31875 -0.49543,4.62761 -1.21214,10.02201 0.14699,14.55209 2.21672,7.38845 10.62078,12.16865 18.06538,10.99633 6.64183,-1.0459 14.8553,-8.69042 11.92483,-16.02342 -2.17657,-5.44649 -8.12988,-9.97846 -12.454,-13.68667 -2.19396,-1.88146 -7.4992,-6.18638 -5.66935,-9.59258 1.7756,-3.30521 5.96588,-1.91287 8.57977,-0.71617 8.31546,3.80699 18.549427,3.89697 25.429597,-3.16826 5.87174,-6.02968 7.85533,-18.0034 -2.14627,-21.09031 -3.85738,-1.190561 -9.450577,-0.675861 -12.964577,1.27432 -2.95103,1.63775 -5.30116,4.18448 -8.20208,5.82819 -2.18708,1.23923 -5.41522,1.79438 -6.72769,-0.91829 -1.55527,-3.2145 1.88407,-6.2712 3.73888,-8.465641 1.42898,-1.69065 2.88812,-3.48143 4.16106,-5.29167 4.58121,-6.51491 7.26297,-19.971864 -3.28892,-22.337084 -1.66754,-0.37378 -3.3212,-0.56955 -5.02708,-0.30092 m 1.32291,3.13825 c 6.24984,-0.89053 8.72664,5.271874 7.29585,10.503924 -1.17366,4.29177 -3.09251,8.38579 -5.84513,11.90625 -3.69028,4.719661 -10.02852,9.047421 -3.82809,14.788901 6.642,6.15036 13.52115,-3.42105 19.04612,-6.10502 1.78846,-0.86881 3.87288,-0.85609 5.820837,-0.7227 6.23008,0.42663 10.30455,3.37982 7.79643,10.03048 -3.43128,9.09854 -12.469507,11.71469 -21.025597,8.95235 -5.64367,-1.82206 -12.90816,-6.32167 -16.71612,1.10182 -1.75421,3.41979 0.20178,6.53469 2.31654,9.26042 2.37156,3.05672 5.1135,5.87063 8.04978,8.395 2.29759,1.97529 5.2866,4.06551 6.87754,6.68625 3.39956,5.60007 -2.54115,12.13357 -7.93607,13.10626 -1.80806,0.32599 -3.76695,0.13116 -5.55625,-0.21088 -1.50339,-0.2874 -2.94656,-0.87664 -4.23335,-1.70347 -9.33122,-5.99581 -4.7625,-16.97402 -4.7625,-26.00858 0,-3.97493 -0.23409,-10.09737 -5.02708,-11.39586 -5.17867,-1.40299 -8.27355,3.6621 -9.34902,7.95628 -0.9392,3.75004 -1.21153,8.09949 -3.4894,11.36667 -4.3318,6.21318 -15.7042,8.21147 -21.820976,3.77052 -4.029573,-2.92559 -3.394665,-8.77242 -1.662629,-12.75594 4.214615,-9.69323 16.117605,-10.11384 24.680355,-13.61339 2.7564,-1.12652 5.98461,-3.20325 6.08134,-6.49495 0.21288,-7.24453 -6.07493,-6.23326 -11.10842,-6.95858 -2.90583,-0.41872 -6.27161,-1.64895 -8.46279,-3.6125 -3.8914,-3.487151 -7.90255,-8.239331 -7.89401,-13.770581 0.0101,-6.56811 9.23703,-10.45861 14.7693,-8.06101 8.03802,3.48356 9.0418,13.09562 13.25693,19.43809 1.93006,2.904141 5.66931,5.070661 8.96807,3.025971 5.22658,-3.239631 2.38061,-9.829831 1.8972,-14.667641 -0.67445,-6.74974 5.32866,-13.277284 11.86114,-14.208084");
        let center = new Path2D(`m ${cx},${cy} c -8.275244,1.91291 -5.57383,14.736632 2.645836,12.985612 8.47225,-1.80482 6.32855,-15.060132 -2.645836,-12.985612 m 0.52917,3.1946 c 4.508986,-1.6635 5.932986,4.533662 1.848196,6.227912 -4.369886,1.81251 -6.029696,-4.68523 -1.848196,-6.227912 z`);

        context.translate(-cx, -cy);

        context.fillStyle = this.flowerColor;
        context.fill(flower);
        context.fillStyle = this.centerColor;
        context.fill(center);
    
        context.restore();
    }
    rotate(increment){
        this.rotation += increment;
    }
}

let spirals = [];

function makeSpirals(color) {
    for (i=0 ; i<20; i++){
        let spiral = new Spiral(color);
        spirals.push(spiral);
    }
}

let flowers = [];
function makeFlowers(colors){
    for (i=0 ; i<10; i++){
        let flower = new Flower(colors);
        flowers.push(flower);
    }
}

let shift = -0.2;
let pos = 0;
function draw() {
    let centerX = canvas.width / 2;
    let centerY = canvas.height / 2;
    let radius = Math.max(canvas.width, canvas.height) / 2; 
    let grad = context.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
    grad.addColorStop(0, sunColor);
    grad.addColorStop(1, skyColor); 
    context.fillStyle= grad;
    context.fillRect(0, 0, canvas.width, canvas.height);


    for (let i = flowers.length - 1; i >= 0; i--) {
        const flower = flowers[i];
        flower.display();
        flower.rotate(flower.speed);
    }

    //sun flare


    context.beginPath();
    context.fillStyle = sunColor.replace(/, *1\)$/, ", 0.35)");
    context.arc(width/1.2, height/1.6, 180, 0, Math.PI * 2);
    context.fill();

    context.beginPath();
    context.fillStyle = sunColor.replace(/, *1\)$/, ", 0.35)");
    context.arc(width/1.2, height/1.6, 165, 0, Math.PI * 2);
    context.fill();

    

    //sun
    context.beginPath();
    context.fillStyle = sunColor;
    context.arc(width/1.2, height/1.6, 150, 0, Math.PI * 2);
    context.fill();

    context.beginPath();
    context.fillStyle = 'rgba(255,255,255,0.12)';
    context.arc(width/1.2, height/1.6, 150, 0, Math.PI * 2);
    context.fill();


    //beach mid ground

    //beach - water 

    

    let start = {x: 0, y:height/1.7};
    let handle1 = {x: width/2, y: height/1.7};
    let handle2 = {x: width/2, y: height/1.5};
    
    let end = {x: width, y: height/1.7};

    context.beginPath();
    context.moveTo(start.x, start.y);
    context.bezierCurveTo(handle1.x, handle1.y, 
            handle2.x, handle2.y, end.x, end.y);

    
    context.fillStyle = waterColor;
    context.lineTo(width, height);
    context.lineTo(0, height);
    context.fill();

    context.beginPath();
    context.moveTo(start.x, start.y);
    context.bezierCurveTo(handle1.x, handle1.y, 
            handle2.x, handle2.y, end.x, end.y);

    
    context.fillStyle = 'rgba(255, 255, 255, 0.24)';
    context.lineTo(width, height);
    context.lineTo(0, height);
    context.fill();



    /////////////////
    start = {x: 0, y:height/1.7};
    handle1 = {x: width/2, y: height/1.7};
    handle2 = {x: width/2, y: height/1.5};

    end = {x: width, y: height/1.7};

    context.beginPath();
    context.moveTo(start.x, start.y);
    context.bezierCurveTo(handle1.x, handle1.y, 
            handle2.x, handle2.y, end.x, end.y);

    
    let x0 = width, y0 = height * 0.75;
    let x1 = 0, y1 = height * 0.25;

    let grad2 = context.createLinearGradient(x0, y0, x1, y1);

    grad2.addColorStop(0, waterColor);
    
    grad2.addColorStop(0.30, sunColor.replace(/, *1\)$/, ", 0.35)"));  
    grad2.addColorStop(0.15, sunColor.replace(/, *1\)$/, ", 0.35)")); 
    grad2.addColorStop(0.65, waterColor); 
    grad2.addColorStop(1, waterColor); 
        

    context.fillStyle = grad2;
    context.lineTo(width, height);
    context.lineTo(0, height);
    context.fill();

    /////////////////////////////////////////////////////////////////////////////////////////////////

    for (let i = spirals.length - 1; i >= 0; i--) {
        const spiral = spirals[i];
        spiral.move(spiral.moveSpeed * deltaTimeMultiplier);
        //spiral.fade(spiral.fadeOut * deltaTimeMultiplier);
        spiral.display();
    }
    


    /////////////////////////////////

    //beach - sand
    
    ///////////////////

    start = {x: 0, y:height/1.7+pos};
    handle1 = {x: width/2, y: height/1.5 +pos};
    handle2 = {x: width/2, y: height/1+pos};
    
    end = {x: width, y: height/1.25+pos};

    context.beginPath();
    context.moveTo(start.x, start.y);
    context.bezierCurveTo(handle1.x, handle1.y, 
        handle2.x, handle2.y, end.x, end.y);
    
    context.fillStyle = sandColor.replace(/, *1\)$/, ", 0.5)");;
    context.lineTo(width, height);
    context.lineTo(0, height);
    context.fill();
    ////////////////////
    start = {x: 0, y:height/1.7+pos+10};
    handle1 = {x: width/2, y: height/1.5 +pos+10};
    handle2 = {x: width/2, y: height/1+pos+10};
    
    end = {x: width, y: height/1.25+pos+10};
    context.beginPath();
    context.moveTo(start.x, start.y);
    context.bezierCurveTo(handle1.x, handle1.y, 
        handle2.x, handle2.y, end.x, end.y);
    
    context.fillStyle = sandColor.replace(/, *1\)$/, ", 0.5)");;
    context.lineTo(width, height);
    context.lineTo(0, height);
    context.fill();
    ///////////////////////////
    start = {x: 0, y:height/1.7+pos+20};
    handle1 = {x: width/2, y: height/1.5 +pos+20};
    handle2 = {x: width/2, y: height/1+pos+20};
    
    end = {x: width, y: height/1.25+pos+20};

    context.beginPath();
    context.moveTo(start.x, start.y);
    context.bezierCurveTo(handle1.x, handle1.y, 
        handle2.x, handle2.y, end.x, end.y);
    
    context.fillStyle = sandColor;
    context.lineTo(width, height);
    context.lineTo(0, height);
    context.fill();

    
    
    
    if (pos <= 0){
        shift*=-1;
    }
    if (pos >= 30){ 
        shift*=-1;
    }
    pos+=(shift) * deltaTimeMultiplier;

    ////////////////////////////////////////
    context.save();
    let umbrella = new Path2D("M 135.08783 41.437088 L 134.71553 46.515252 A 67.961433 44.815483 0 0 0 132.41036 46.416536 A 67.961433 44.815483 0 0 0 114.82057 47.94364 A 67.961433 44.815483 0 0 0 68.437224 76.383003 A 31.811481 25.980397 35.833258 0 1 69.882365 75.964317 A 31.811481 25.980397 35.833258 0 1 96.302614 82.385406 A 31.811481 25.980397 35.833258 0 1 103.8178 89.556381 A 43.419601 29.328639 4.8255916 0 1 131.87873 85.194744 L 125.28514 175.09456 L 127.17887 175.18379 L 133.76889 85.33279 A 43.419601 29.328639 4.8255916 0 1 152.87013 90.629058 A 43.419601 29.328639 4.8255916 0 1 154.6509 91.52704 A 35.691832 26.379212 10.488027 0 1 200.08133 88.30694 A 67.961433 44.815483 0 0 0 136.61006 46.595949 L 136.98207 41.526208 L 135.08783 41.437088 z ");
    let accent = new Path2D("m 135.73125,167.05375 c 0,0 22.25477,-38.66766 37.22616,-36.23986 14.97139,2.42779 12.25277,48.46734 12.25277,48.46734 0,0 -15.48983,-11.82285 -49.47893,-12.22748 z");
    

    //umbrella
    context.translate(width/-20, height/2.5);
    context.rotate((15 * Math.PI) / 180);
    context.scale(1.5*width/height, 1.5*width/height);
    context.fillStyle = sunColor;
    context.fill(umbrella)

    //accent color
     
    context.fillStyle = waterColor;
    context.translate(-63, -45);
    context.rotate((-12 * Math.PI) / 180);
    context.fill(accent); 

    context.restore();
    requestAnimationFrame(draw);
    
}
// wait for the DOM to load, including dependent resources
window.addEventListener('load', () => {
    setup();
    sampleColors();
    makeSpirals(skyColor);
    makeFlowers(colors);
    draw();
    window.requestAnimationFrame(draw);
});

window.addEventListener('resize', () => {
    setup();
});