const myCanvas = document.getElementById('myLavaLamp');
const myCtx = myCanvas.getContext('2d');
const myMusicFile = document.getElementById('myMusicFile');

myCanvas.width = 600;
myCanvas.height = 800;

let myAudioContext, myAudioSrc, myAnalyser, myDataArray, myBufferLength;

myMusicFile.addEventListener('change', handleMusicFile);

function handleMusicFile(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    
    reader.onload = function(e) {
        const audioData = e.target.result;
        myAudioContext = new (window.AudioContext || window.webkitAudioContext)();
        myAudioContext.decodeAudioData(audioData, function(buffer) {
            playMusic(buffer);
        });
    };
    
    reader.readAsArrayBuffer(file);
}

function playMusic(buffer) {
    myAudioSrc = myAudioContext.createBufferSource();
    myAudioSrc.buffer = buffer;
    myAnalyser = myAudioContext.createAnalyser();
    myAudioSrc.connect(myAnalyser);
    myAnalyser.connect(myAudioContext.destination);
    
    myAnalyser.fftSize = 256;
    myBufferLength = myAnalyser.frequencyBinCount;
    myDataArray = new Uint8Array(myBufferLength);
    
    myAudioSrc.start(0);
    animateLavaLamp();
}

function animateLavaLamp() {
    requestAnimationFrame(animateLavaLamp);
    myAnalyser.getByteFrequencyData(myDataArray);
    
    myCtx.clearRect(0, 0, myCanvas.width, myCanvas.height);
    
    for (let i = 0; i < myBufferLength; i++) {
        const barHeight = myDataArray[i];
        const x = i * 10;
        const y = myCanvas.height - barHeight;
        myCtx.fillStyle = `rgb(${barHeight + 100}, 50, 150)`;
        myCtx.fillRect(x, y, 8, barHeight);
    }
}
