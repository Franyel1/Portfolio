// Adapted from supplied coursework: FinalProject/watchingTV/background.js
export default function createStudy({ window, document, requestAnimationFrame }) {
const bgCanvas = document.querySelector("#backgroundStatic");
const bgContext = bgCanvas.getContext("2d");

let bgWidth;
let bgHeight;
let bgPxScale = window.devicePixelRatio;

let bgStatic = [];

let bgFps = 60;
let bgPreviousTime = performance.now();
let bgFrameInterval = Math.floor(1000 / bgFps);
let bgDeltaTimeMultiplier = 1;


function setupBackground() {
    bgStatic = [];

    bgWidth = window.innerWidth;
    bgHeight = window.innerHeight;

    bgCanvas.style.width = `${bgWidth}px`;
    bgCanvas.style.height = `${bgHeight}px`;

    bgCanvas.width = Math.floor(bgWidth * bgPxScale);
    bgCanvas.height = Math.floor(bgHeight * bgPxScale);

    bgContext.setTransform(bgPxScale, 0, 0, bgPxScale, 0, 0);

    for (let i = 0; i < 500; i++) {
        let w = Math.random() * 28 + 4;
        let h = Math.random() * 18 + 2;

        let x = Math.random() * (bgWidth - w);
        let y = Math.random() * (bgHeight - h);

        let shade = Math.floor(Math.random() * 120) + 40;

        bgStatic.push(new BackgroundStaticParticle(x, y, w, h, [shade, shade, shade]));
    }


}

function drawBackground(currentTime) {
    let deltaTime = currentTime - bgPreviousTime;
    bgDeltaTimeMultiplier = deltaTime / bgFrameInterval;
    bgPreviousTime = currentTime;

    bgContext.clearRect(0, 0, bgWidth, bgHeight);

    bgContext.fillStyle = "rgba(5, 5, 5, 0.35)";
    bgContext.fillRect(0, 0, bgWidth, bgHeight);

    for (let i = 0; i < bgStatic.length; i++) {
        bgStatic[i].move();
        bgStatic[i].display();
    }

    const bandH = bgHeight / 6;
    const yStart = bgHeight - bandH;

    bgContext.fillStyle = "rgb(63, 63, 63)";
    bgContext.fillRect(0, yStart, bgWidth, bandH);

    for (let i = 0; i < 120; i++) {
        bgContext.fillStyle = `rgba(200,200,200,${Math.random() * 0.25})`;

        bgContext.fillRect(
            Math.random() * 20,
            yStart + Math.random() * bandH,
            bgWidth,
            Math.random() * 4
        );
    }

    for (let i = 0; i < 40; i++) {
        bgContext.fillStyle = `rgba(${150 + Math.random() * 100}, ${150 + Math.random() * 100}, ${150 + Math.random() * 100}, 0.2)`;

        bgContext.fillRect(
            Math.random() * bgWidth,
            yStart + Math.random() * bandH,
            Math.random() * 120,
            Math.random() * 12
        );
    }

    requestAnimationFrame(drawBackground);
}

class BackgroundStaticParticle {
    constructor(x, y, w, h, color) {
        this.x = x;
        this.y = y;
        this.originalX = x;
        this.originalY = y;
        this.w = w;
        this.h = h;
        this.color = color;

        this.maxMoveY = 2;
        this.maxMoveX = 4;
    }

    display() {
        bgContext.fillStyle = `rgba(${this.color[0]}, ${this.color[1]}, ${this.color[2]}, .18)`;
        bgContext.fillRect(this.x, this.y, this.w, this.h);
    }

    move() {
        let nextX = this.originalX + (Math.random() - 0.5) * this.maxMoveX * bgDeltaTimeMultiplier;
        let nextY = this.originalY + (Math.random() - 0.5) * this.maxMoveY * bgDeltaTimeMultiplier;

        this.x = Math.max(0, Math.min(bgWidth - this.w, nextX));
        this.y = Math.max(0, Math.min(bgHeight - this.h, nextY));
    }
}



window.addEventListener("load", () => {
    setupBackground();
    requestAnimationFrame(drawBackground);
});

window.addEventListener("resize", () => {
    setupBackground();
});



}
