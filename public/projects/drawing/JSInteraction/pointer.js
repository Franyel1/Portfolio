const spotlight = document.querySelector('.spotlight');
const bird = document.querySelector('.bird');
const scriptBox = document.querySelector('.scriptBox');

let lastX = window.innerWidth / 2;

document.addEventListener('pointermove', (e) => {
    const x = e.clientX;
    const y = e.clientY;

    // spotlight
    spotlight.style.setProperty('--clientX', x + 'px');
    spotlight.style.setProperty('--clientY', y + 'px');

    // bird
    const flip = x >= lastX ? 1 : -1;
    lastX = x;

    const offsetX = 100;
    const offsetY = 70;

    bird.style.transform = `translate(${x - offsetX}px, ${y - offsetY}px) scaleX(${flip})`;

    //script
    const nx = x / window.innerWidth;
    const ny = y / window.innerHeight;

    const scriptY = (ny - 0.5) * 160;
    const scriptTilt = (nx - 0.5) * 10;

    scriptBox.style.transform =
        `translate(-50%, -50%) translateY(${scriptY}px) rotate(${scriptTilt}deg)`;
});