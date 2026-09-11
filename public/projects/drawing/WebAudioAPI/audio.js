// access the container
const container = document.querySelector("#container");

// access the audio element
const audioElement = document.querySelector("audio");

// create audio context
const audioContext = new AudioContext();

const playButton = document.querySelector("#play");
const pauseButton = document.querySelector("#pause");

// pass it into the audio context
const audioTrack = audioContext.createMediaElementSource(audioElement);

/* Audio analysis */
const analyzer = new AnalyserNode(audioContext, { smoothingTimeConstant: 0.95, fftSize: 256 }); // avg samples for smoother waveform

const bufferLength = analyzer.frequencyBinCount; // (read-only property)
// console.log(bufferLength);

let dataArray = new Uint8Array(bufferLength); // unsigned (positive) integer array

// connect audio graph
audioTrack.connect(analyzer).connect(audioContext.destination);

// data sequence
let dataSequence; // global variable for animation sequence



const leftFire = document.querySelector("#left");
const rightFire = document.querySelector("#right");

const pigeonA = document.querySelector("#a");
const pigeonB = document.querySelector("#b");

const cctv = document.querySelector("#cctv");
const overlay = document.querySelector("#overlay");

const invertBox = document.querySelector("#invertBox");

let rotation = 0;

function frequencyData() {
    // access the current waveform, or "time-domain"
    analyzer.getByteFrequencyData(dataArray);
    // console.log('Frequency data array:', dataArray);

    let frequencyTotal = Array.from(dataArray).reduce((total, bin) => total + bin, 0);

    let scale = (frequencyTotal / dataArray.length) / 128;

    container.style.filter = `hue-rotate(${Math.floor(360 * scale)}deg)`;

    let fireScale = 1 + scale * 0.4;
    leftFire.style.transform = `scale(${fireScale})`;
    rightFire.style.transform = `scale(-${fireScale}) scaleX(1)`;

    let offset = Math.sin(Date.now() / 200) * scale * 70;
    let yOffset = Math.cos(Date.now() / 300) * scale * 40;

    // pigeonA.style.transform = `translate(${offset}px, ${yOffset}px)`;
    // pigeonB.style.transform = `translate(${-offset}px, ${-yOffset}px) rotate(180deg)`;

    rotation += scale * 1.5;

    //cctv.style.transform = `rotate(${Math.sin(rotation) * scale * 8}deg)`;

    overlay.style.opacity = 0.2 + scale * 0.25;



    let time = Date.now() / 500;

    let bassImpact = 1 + scale * 4;

    let x = Math.sin(time) * 90 * bassImpact;
    let y = Math.sin(time * 2) * 45 * bassImpact;

    let size = 1 + scale * 0.8;

    invertBox.style.transform = `translate(${x*scale}px, ${y*scale}px) scale(${size/2})`;


    dataSequence = requestAnimationFrame(frequencyData);
}


// control playback: play
playButton.addEventListener("click", () => {
    if (audioElement.paused) {
        // check if context is in suspended state (autoplay policy)
        if (audioContext.state == "suspended") {
            audioContext.resume();
        }
        playButton.style.backgroundColor = 'green';
        playButton.style.color = 'white';
        playButton.textContent = 'Pause';
        audioElement.play();
        frequencyData();
    } else {
        audioElement.pause();
        cancelAnimationFrame(dataSequence);
        playButton.style.backgroundColor = 'red';
        playButton.style.color = 'white';
        playButton.textContent = 'Play';
    }
});