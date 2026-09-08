const scene = document.querySelector('#scene');
const plane = document.querySelector('#plane');
const cylinder = document.querySelector('#cylinder');
const film = document.querySelector('#film');

function buildCylinder() {
    cylinder.innerHTML = '';

    const diameter = 140;
    const height = 300;

    cylinder.style.width = `${diameter}px`;
    cylinder.style.height = `${height}px`;

    const slices = 13;
    const radius = diameter / 2;
    const panelWidth = (Math.PI * diameter) / slices;

    for (let i = 0; i < slices; i++) {
        const panel = document.createElement('div');
        panel.className = 'panel';
        panel.style.width = `${panelWidth}px`;

        const angle = (360 / slices) * i;

        panel.style.transform =
            `translateX(-50%) rotateY(${angle}deg) translateZ(${radius}px)`;

        cylinder.appendChild(panel);
    }

    const top = document.createElement('div');
    top.className = 'cap top';
    cylinder.appendChild(top);

    const bottom = document.createElement('div');
    bottom.className = 'cap bottom';
    cylinder.appendChild(bottom);
}

function displayHeight() {
    scene.style.height = window.innerHeight + 'px';
}

function elementTransform() {
    const maxScrollX = document.documentElement.scrollWidth - window.innerWidth;
    const scrollX = window.scrollX;
    const t = scrollX / maxScrollX;

    const rotation = t * 360;
    plane.style.transform = `rotateY(-${rotation}deg)`;

    const maxFilm = 1000;
    const filmLen = t * maxFilm;

    film.style.width = `${filmLen}px`;

    film.style.transform = `translateX(70px) translateZ(0px) translateY(-20px)`;

    document.body.style.backgroundColor = `rgba(0,0,0,${t})`;
}

window.addEventListener('load', () => {
    displayHeight();
    buildCylinder();
    elementTransform();
});

window.addEventListener('resize', () => {
    displayHeight();
    buildCylinder();
    elementTransform();
});

window.addEventListener('scroll', () => {
    elementTransform();
});