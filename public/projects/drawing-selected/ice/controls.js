const wall = document.getElementById('wall');
const colors = ['yellow', 'magenta', 'cyan'];

function createFace() {
    const face = document.createElement('div');
    face.className = 'face';

    const overlay = document.createElement('div');
    overlay.className = 'over';

    const c = colors[Math.floor(Math.random() * colors.length)];
    face.style.border = `2px solid ${c}`;
    face.style.boxShadow = `0 0 6px ${c}, 0 0 12px ${c}`;

    const img = document.createElement('img');
    img.className = 'texture';
    img.src = c === 'cyan'
    ? 'iceCyan.svg'
    : c === 'magenta'
        ? 'iceMagenta.svg'
        : 'iceYellow.svg';



    face.appendChild(overlay);
    face.appendChild(img);
    return face;
};
const breakContext = new AudioContext();
let breakBuffer = null;

fetch('break.mp3')
  .then(res => res.arrayBuffer())
  .then(buf => breakContext.decodeAudioData(buf))
  .then(decoded => {
    breakBuffer = decoded;
  });


const cols = 6;
const spacing = 250;
const cubeSize = 200;
function startIce(){
    for (let i = 0; i < 30; i++) {
        const cube = document.createElement('div');
        cube.className = 'cube';

        for (let j = 0; j < 6; j++) {
            cube.appendChild(createFace());
        }

        const col = i % cols;
        const row = Math.floor(i / cols);
        cube.style.left = `${col * spacing}px`;
        cube.style.top = `${row * spacing}px`;

        wall.appendChild(cube);


        cube.addEventListener('click', (e) => {
            cube.classList.add('breaking');

            if (breakBuffer) {
                const source = breakContext.createBufferSource();
                source.buffer = breakBuffer;
                source.playbackRate.value = 0.8 + Math.random() * 0.4;
                source.connect(breakContext.destination);
                source.start(0);
            }
        
            const crack = document.createElement('img');
            const eye = document.createElement('img');


            setTimeout(() => {
                cube.remove();
                crack.src = 'crack3.png';
                crack.className = 'crack';
                document.body.appendChild(crack);

                crack.style.left = `${e.clientX -45}px`;
                crack.style.top = `${e.clientY-45}px`;

                eye.src = 'eye.gif';
                eye.className = 'eye'
                document.getElementById('eyes').appendChild(eye);

                eye.style.left = `${Math.random()*window.innerWidth}px`;
                eye.style.top = `${Math.random()*window.innerHeight}px`;
                eye.style.opacity = `${Math.random()*0.5+0.1}`


            }, 400);
            setTimeout(()=>{
                crack.style.opacity = 0;
            }, 600)

            brokenCount++;
            personAudio.volume =0.75;

            muffler.frequency.value = (brokenCount / totalCubes) * 500;

            document.getElementById('figure').style.opacity = (brokenCount / totalCubes)*2;

        });

    }

    document.addEventListener('pointermove', (e) => {
        const { clientX: mouseX, clientY: mouseY } = e;
        const { innerWidth, innerHeight } = window;
    
        const centerX = innerWidth / 2;
        const centerY = innerHeight / 2;
    
        const offsetX = (mouseX - centerX) / centerX;
        const offsetY = (mouseY - centerY) / centerY;
    
        const cubes = document.querySelectorAll('.cube');
    
        cubes.forEach(cube => {
        const rotateX = offsetY * -20;
        const rotateY = offsetX * 20;
        cube.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

    });

    const personAudio = new Audio('voice.mp3');
    personAudio.loop = true;

    const globalAudioContext = new (window.AudioContext || window.webkitAudioContext)();
    const personSource = globalAudioContext.createMediaElementSource(personAudio);

    const muffler = globalAudioContext.createBiquadFilter();
    muffler.type = 'lowpass';
    muffler.frequency.value = 200; 
    personSource.connect(muffler).connect(globalAudioContext.destination);

    let brokenCount = 0;
    const totalCubes = 30;


    document.addEventListener('click', () => {
        if (globalAudioContext.state === 'suspended') {
        globalAudioContext.resume();
        }
        if (personAudio.paused) {
        personAudio.volume =0;
        personAudio.play();

        }
    }, { once: true });

}

document.getElementById('popup').addEventListener('click', () => {
    document.getElementById('popup').style.display = 'none';
    startIce();
});