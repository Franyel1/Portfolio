// Adapted from supplied coursework: FinalProject/whatToWatch/script.js
export default function createStudy({ window, document, requestAnimationFrame }) {
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 700;
canvas.height = 450;

let objects = [];
let audioCtx;
let master;

function audio() {
// Sound intentionally disabled in the collage.
}

function randColor() {
    return [
        Math.random() * 255,
        Math.random() * 255,
        Math.random() * 255
    ];
}

function rgba(c, a = 1) {
    return `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${a})`;
}

function freq(c) {
    return 180 + ((c[0] + c[1] + c[2]) / 3) * 2;
}

function tone(c) {
// Sound intentionally disabled in the collage.
}

function hat() {
// Sound intentionally disabled in the collage.
}

function woo(c) {
// Sound intentionally disabled in the collage.
}

class Circle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.r = Math.random() * 25 + 12;
        this.vx = Math.random() * 4 - 2;
        this.vy = Math.random() * 4 - 2;
        this.c = randColor();
        this.cooldown = 0;
    }

    move() {
        this.x += this.vx;
        this.y += this.vy;
        this.cooldown--;

        let hit = false;

        if (this.x <= this.r || this.x >= canvas.width - this.r) {
            this.vx *= -1;
            this.x = Math.max(this.r, Math.min(canvas.width - this.r, this.x));
            hit = true;
        }

        if (this.y <= this.r || this.y >= canvas.height - this.r) {
            this.vy *= -1;
            this.y = Math.max(this.r, Math.min(canvas.height - this.r, this.y));
            hit = true;
        }

        if (hit && this.cooldown <= 0) {
            this.cooldown = 12;
            this.c = randColor();
            tone(this.c);
        }
    }

    draw() {
        ctx.fillStyle = rgba(this.c, 0.85);
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fill();
    }
}

class Line {
    constructor() {
        this.y = Math.random() * 50;
        this.speed = Math.random() * 5 + 2;
        this.c = randColor();
    }

    move() {
        this.y += this.speed;

        if (this.y > canvas.height) {
            this.y = 0;
            this.c = randColor();
            hat();
        }
    }

    draw() {
        ctx.strokeStyle = rgba(this.c, 0.9);
        ctx.lineWidth = Math.random() * 4 + 1;
        ctx.beginPath();
        ctx.moveTo(0, this.y);
        ctx.lineTo(canvas.width, this.y + Math.random() * 24 - 12);
        ctx.stroke();
    }
}

class Triangle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 40 + 25;
        this.angle = 0;
        this.spin = Math.random() * 0.08 + 0.03;
        this.c = randColor();
        this.timer = Math.random() * 80;
    }

    move() {
        this.angle += this.spin;
        this.timer++;

        if (this.timer > 90) {
            this.timer = 0;
            this.c = randColor();
            woo(this.c);
        }
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);

        ctx.fillStyle = rgba(this.c, 0.75);
        ctx.beginPath();
        ctx.moveTo(0, -this.size);
        ctx.lineTo(this.size, this.size);
        ctx.lineTo(-this.size, this.size);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
    }
}

function drawStatic() {
    for (let i = 0; i < 100; i++) {
        const shade = Math.random() * 255;
        ctx.fillStyle = `rgba(${shade}, ${shade}, ${shade}, ${Math.random()})`;
        ctx.fillRect(
            Math.random() * canvas.width,
            Math.random() * canvas.height,
            Math.random() * 8,
            Math.random() * 8
        );
    }
}

function pixelizeCanvas() {
    const cellW = 12;   // width (bigger)
    const cellH = 6;    // height (smaller)
    const gap = 2;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let y = 0; y < canvas.height; y += cellH) {
        for (let x = 0; x < canvas.width; x += cellW) {

            const px = Math.floor(x + cellW / 2);
            const py = Math.floor(y + cellH / 2);
            const index = (py * canvas.width + px) * 4;

            const r = imageData.data[index];
            const g = imageData.data[index + 1];
            const b = imageData.data[index + 2];
            const a = imageData.data[index + 3] / 255;

            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;

            const stripeW = (cellW - gap) / 3;

            const baseX = x + gap / 2;
            const baseY = y + gap / 2;
            const h = cellH - gap;

            ctx.fillStyle = `rgba(${r + 10}, ${g+10}, ${b+10}, ${a})`;
            ctx.fillRect(baseX, baseY, stripeW, h);

            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
            ctx.fillRect(baseX + stripeW, baseY, stripeW, h);

            ctx.fillStyle = `rgba(${r+10}, ${g+10}, ${b + 10}, ${a})`;
            ctx.fillRect(baseX + stripeW * 2, baseY, stripeW, h);
        }
    }
}

function draw() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawStatic();

    objects.forEach(obj => {
        obj.move();
        obj.draw();
    });

    pixelizeCanvas();

    requestAnimationFrame(draw);
}

function removeType(type) {
    const index = objects.map(obj => obj.constructor.name).lastIndexOf(type);

    if (index !== -1) {
        objects.splice(index, 1);
    }
}

document.querySelector("#volUp").addEventListener("click", () => {
    audio();
    objects.push(new Circle());
});

document.querySelector("#volDown").addEventListener("click", () => {
    removeType("Circle");
});

document.querySelector("#chanUp").addEventListener("click", () => {
    audio();
    objects.push(new Line());
});

document.querySelector("#chanDown").addEventListener("click", () => {
    removeType("Line");
});

document.querySelector("#tuneUp").addEventListener("click", () => {
    audio();
    objects.push(new Triangle());
});

document.querySelector("#tuneDown").addEventListener("click", () => {
    removeType("Triangle");
});

document.querySelector("#reset").addEventListener("click", () => {
    objects = [];
});

draw();
objects.push(new Circle(), new Line(), new Triangle());

}
