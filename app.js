document.getElementById("connect").addEventListener("click", connect);
document.getElementById("disconnect").addEventListener("click", disconnect);

let noteSeparation = 15;
let offsetHorizontal = -294;
let offsetVertical = 360;
let noteHeight = 100;
let noteWidth = 10;
let brightness = 47;
let separation = 2; // cuanto tiempo (segundos) representa el modulo de neopixel en vertical
let a = 100
let b = 1
let showLeds = true;
let showPartiture = true;

let socket = null;

let midi;

let notesToSend = [];

let synths = []


const sampler = new Tone.Sampler({
  urls: {
    'A0': 'A0.mp3',
    'A1': 'A1.mp3',
    'A2': 'A2.mp3',
    'A3': 'A3.mp3',
    'A4': 'A4.mp3',
    'A5': 'A5.mp3',
    'A6': 'A6.mp3',
    'A#0': 'As0.mp3',
    'A#1': 'As1.mp3',
    'A#2': 'As2.mp3',
    'A#3': 'As3.mp3',
    'A#4': 'As4.mp3',
    'A#5': 'As5.mp3',
    'A#6': 'As6.mp3',
    'B0': 'B0.mp3',
    'B1': 'B1.mp3',
    'B2': 'B2.mp3',
    'B3': 'B3.mp3',
    'B4': 'B4.mp3',
    'B5': 'B5.mp3',
    'B6': 'B6.mp3',
    'C0': 'C0.mp3',
    'C1': 'C1.mp3',
    'C2': 'C2.mp3',
    'C3': 'C3.mp3',
    'C4': 'C4.mp3',
    'C5': 'C5.mp3',
    'C6': 'C6.mp3',
    'C7': 'C7.mp3',
    'C#0': 'Cs0.mp3',
    'C#1': 'Cs1.mp3',
    'C#2': 'Cs2.mp3',
    'C#3': 'Cs3.mp3',
    'C#4': 'Cs4.mp3',
    'C#5': 'Cs5.mp3',
    'C#6': 'Cs6.mp3',
    'D0': 'D0.mp3',
    'D1': 'D1.mp3',
    'D2': 'D2.mp3',
    'D3': 'D3.mp3',
    'D4': 'D4.mp3',
    'D5': 'D5.mp3',
    'D6': 'D6.mp3',
    'D#0': 'Ds0.mp3',
    'D#1': 'Ds1.mp3',
    'D#2': 'Ds2.mp3',
    'D#3': 'Ds3.mp3',
    'D#4': 'Ds4.mp3',
    'D#5': 'Ds5.mp3',
    'D#6': 'Ds6.mp3',
    'E0': 'E0.mp3',
    'E1': 'E1.mp3',
    'E2': 'E2.mp3',
    'E3': 'E3.mp3',
    'E4': 'E4.mp3',
    'E5': 'E5.mp3',
    'E6': 'E6.mp3',
    'F0': 'F0.mp3',
    'F1': 'F1.mp3',
    'F2': 'F2.mp3',
    'F3': 'F3.mp3',
    'F4': 'F4.mp3',
    'F5': 'F5.mp3',
    'F6': 'F6.mp3',
    'F#0': 'Fs0.mp3',
    'F#1': 'Fs1.mp3',
    'F#2': 'Fs2.mp3',
    'F#3': 'Fs3.mp3',
    'F#4': 'Fs4.mp3',
    'F#5': 'Fs5.mp3',
    'F#6': 'Fs6.mp3',
    'G0': 'G0.mp3',
    'G1': 'G1.mp3',
    'G2': 'G2.mp3',
    'G3': 'G3.mp3',
    'G4': 'G4.mp3',
    'G5': 'G5.mp3',
    'G6': 'G6.mp3',
    'G#0': 'Gs0.mp3',
    'G#1': 'Gs1.mp3',
    'G#2': 'Gs2.mp3',
    'G#3': 'Gs3.mp3',
    'G#4': 'Gs4.mp3',
    'G#5': 'Gs5.mp3',
    'G#6': 'Gs6.mp3'
 
  },
  baseUrl: "./samples/piano/",
  onload: () => {
    console.log('cargado piano')
  }
}).toDestination();

async function f2() {
  // load a midi file in the browser
  midi = await Midi.fromUrl("./midis/Moonlight.mid");

  //midi2 = await fetch("./midis/simple.json")
  //midi = await midi2.json();

  midi.tracks.forEach((track, trackIndex) => {
   /*const synth = SampleLibrary.load({
      instruments: "piano",
    }).toDestination();
*/
    //const synth = new Tone.PolySynth().toDestination();

    


    synths.push(sampler)


    track.notes.forEach((note) => {
      //note.trackIndex = trackIndex;
      note.isSing = false;
    });


  });

  Tone.Transport.bpm.value = 120;

  const noteArray = jsonMidiToArray(midi);

  const part = new Tone.Part((time, note) => {
   synths[note.trackIndex].triggerAttackRelease(
      note.note,
      note.duration,
      time,
      note.velocity
    );
    document.getElementById("time").innerHTML = Tone.Transport.seconds

  }, noteArray).start(0);

  console.log(noteArray);

  const scheduler = Tone.Transport.scheduleRepeat((time) => {
    document.getElementById("timeRangeValue").innerHTML = parseFloat(Tone.Transport.position);
    document.getElementById("timeRange").value = parseFloat(Tone.Transport.position);

    document.getElementById("time").innerHTML = Tone.Transport.seconds

    notesToSend = calculeNotesToDisplay();

    if (socket != null && socket.readyState !== WebSocket.CLOSED) {
      sendNotesToNeopixel(notesToSend);
    }

  }, "8n");

  Tone.start()
}



f2();

async function start() {
  Tone.Transport.start(undefined, Tone.Transport.position);
}

function stop() {
  Tone.Transport.pause();
}

function reset() {
  Tone.Transport.pause();

  Tone.Transport.start(undefined, 0);
}

function setup() {
  createCanvas(1400, 800);
}

function draw() {
  if (!midi) return;
  drawAll(notesToSend);
}
