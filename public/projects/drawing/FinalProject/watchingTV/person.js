const tv = document.querySelector(".tv");
const person = document.querySelector(".person");
const scene = document.querySelector(".scene");

let personX = 0;
let personDirection = 1;
let speed = 4;

let targetX = 0;
let targetY = 0;

let useMouseTarget = false;

function animatePerson() {
    const sceneWidth = window.innerWidth;
    const personWidth = person.getBoundingClientRect().width;

    personX += speed * personDirection;

    if (personX > sceneWidth - personWidth) {
        personX = sceneWidth - personWidth;
        personDirection = -1;
    }

    if (personX < 0) {
        personX = 0;
        personDirection = 1;
    }

    const walkBounce = Math.sin(performance.now() * 0.005) * 6;
    const flip = personDirection === 1 ? 1 : -1;

    person.style.transform = `
        translateX(${personX}px)
        translateY(${walkBounce}px)
        scaleX(${flip})
    `;

    if (!useMouseTarget) {
        const personRect = person.getBoundingClientRect();

        targetX = personRect.left + personRect.width / 2;
        targetY = personRect.top + personRect.height / 2;
    }

    rotateTVTowardTarget();

    requestAnimationFrame(animatePerson);
}

function rotateTVTowardTarget() {
    const tvRect = tv.getBoundingClientRect();

    const tvCenterX = tvRect.left + tvRect.width / 2;
    const tvCenterY = tvRect.top + tvRect.height / 2;

    const dx = targetX - tvCenterX;
    const dy = targetY - tvCenterY;

    const rotateY = dx * 0.08;
    const rotateX = -18 - dy * 0.04;

    tv.style.transform = `
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
    `;
}

const eyes = document.querySelector('.eyes');

window.addEventListener("pointerdown", function (event) {
    targetX = event.clientX;
    targetY = event.clientY;

    useMouseTarget = true;
    eyes.style.display = 'block'
});

window.addEventListener("pointermove", function (event) {
    if (useMouseTarget) {
        targetX = event.clientX;
        targetY = event.clientY;
    }
});

window.addEventListener("pointerup", function () {
    useMouseTarget = false;
    eyes.style.display = 'none'
});

animatePerson();