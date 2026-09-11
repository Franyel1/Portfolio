const screen = document.querySelector(".screen");
const canvas = document.querySelector(".screen canvas");
const context = canvas.getContext("2d");

let width;
let height;
let pxScale = window.devicePixelRatio;

let tvStatic = [];
let barColors = [];
let midBars = [];
let lowBars = [];

let fps = 60;
let previousTime = performance.now();
let frameInterval = Math.floor(1000 / fps);
let deltaTimeMultiplier = 1;
let deltaTime = 0;

function setup() {
    tvStatic = [];
    barColors = [];
    midBars = [];
    lowBars = [];

    width = screen.clientWidth;
    height = screen.clientHeight;

    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    canvas.width = Math.floor(width * pxScale);
    canvas.height = Math.floor(height * pxScale);

    context.setTransform(pxScale, 0, 0, pxScale, 0, 0);

    let numBars = 8;
    let barWidth = width / numBars;

    for (let i = 0; i < numBars; i++) {
        barColors.push(randomColor());
    }

    for (let i = 0; i < numBars - 1; i++) {
        for (let j = 0; j < 18; j++) {
            let color = barColors[i];

            let w = Math.random() * 6 + 1;
            let h = Math.random() * 3 + 1;

            let x = (i + 1) * barWidth + Math.random() * 5;
            let y = Math.random() * (height * 0.65);

            tvStatic.push(
                new TVStaticParticle(x,y,w,h,[color[0] - 10, color[1] - 10, color[2] - 10]
                )
            );
        }
    }

    for (let i = 1; i < numBars - 1; i++) {
        for (let j = 0; j < 18; j++) {
            let color = barColors[i];

            let w = Math.random() * 6 + 1;
            let h = Math.random() * 3 + 1;

            let x = i * barWidth + Math.random() * 5;
            let y = Math.random() * (height * 0.65);

            tvStatic.push(
                new TVStaticParticle(x,y,w,h,[color[0] - 10, color[1] - 10, color[2] - 10]
                )
            );
        }
    }

    let midNumBars = 8;
    let midBarWidth = width / midNumBars;

    for (let i = 0; i < midNumBars; i++) {
        midBars.push(
            new Bar(i * midBarWidth,height * 0.67,midBarWidth,height * 0.15,randomColor()
            )
        );
    }

    let lowNumBars = 7;
    let lowBarWidth = width / lowNumBars;

    for (let i = 0; i < lowNumBars; i++) {
        lowBars.push(
            new Bar(i * lowBarWidth,height * 0.78,lowBarWidth,height * 0.22,randomColor()
            )
        );
    }
}

function draw(currentTime) {
    deltaTime = currentTime - previousTime;
    deltaTimeMultiplier = deltaTime / frameInterval;
    previousTime = currentTime;

    context.clearRect(0, 0, width, height);

    let numBars = 8;
    let barWidth = width / numBars;

    for (let i = 0; i < numBars; i++) {
        context.fillStyle = `rgba(${barColors[i][0]}, ${barColors[i][1]}, ${barColors[i][2]}, 1)`;
        context.fillRect(i * barWidth, 0, barWidth, height);
    }

    for (let i = 0; i < midBars.length; i++) {
        midBars[i].colorShift();
        context.fillStyle = midBars[i].color2;
        context.fillRect(midBars[i].x, midBars[i].y, midBars[i].w, midBars[i].h);
    }

    for (let i = 0; i < lowBars.length; i++) {
        lowBars[i].colorShift();
        context.fillStyle = lowBars[i].color2;
        context.fillRect(lowBars[i].x, lowBars[i].y, lowBars[i].w, lowBars[i].h);
    }

    for (let i = 0; i < tvStatic.length; i++) {
        tvStatic[i].move();
        tvStatic[i].display();
    }

    requestAnimationFrame(draw);
}

function randomColor() {
    return [
        Math.floor(Math.random() * 255),
        Math.floor(Math.random() * 255),
        Math.floor(Math.random() * 255)
    ];
}

class TVStaticParticle {
    constructor(x, y, w, h, color) {
        this.x = x;
        this.y = y;
        this.originalX = x;
        this.originalY = y;
        this.w = w;
        this.h = h;
        this.color = color;

        this.maxMoveY = 3;
        this.maxMoveX = 5;
    }

    display() {
        context.fillStyle = `rgba(${this.color[0]}, ${this.color[1]}, ${this.color[2]}, .65)`;
        context.fillRect(this.x, this.y, this.w, this.h);
    }

    move() {
        let nextX = this.originalX + (Math.random() - 0.5) * this.maxMoveX * deltaTimeMultiplier;
        let nextY = this.originalY + (Math.random() - 0.5) * this.maxMoveY * deltaTimeMultiplier;

        this.x = Math.max(0, Math.min(width - this.w, nextX));
        this.y = Math.max(0, Math.min(height - this.h, nextY));
    }
}

class Bar {
    constructor(x, y, w, h, color) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.color = color;
        this.color2 = `rgba(${color[0]}, ${color[1]}, ${color[2]}, 1)`;
    }

    colorShift() {
        this.color[0] += (Math.random() - 0.5) * 10;
        this.color[1] += (Math.random() - 0.5) * 10;
        this.color[2] += (Math.random() - 0.5) * 10;

        this.color[0] = Math.max(0, Math.min(255, this.color[0]));
        this.color[1] = Math.max(0, Math.min(255, this.color[1]));
        this.color[2] = Math.max(0, Math.min(255, this.color[2]));

        this.color2 = `rgba(${this.color[0]}, ${this.color[1]}, ${this.color[2]}, 1)`;
    }
}

window.addEventListener("load", () => {
    setup();
    requestAnimationFrame(draw);
});

window.addEventListener("resize", () => {
    setup();
});