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

let isPlaying = false;

let scheduler;
let realTime = 0;

let notesToSend = [];

let ro = 0;
let co = 0;

let synth
async function f2() {
  // load a midi file in the browser
  midi = await Midi.fromUrl("./midis/Moonlight.mid");

//midi2 = await fetch("./midis/simple.json")
//midi = await midi2.json();

  midi.tracks.forEach((track, trackIndex) => {
    if (trackIndex === 0) {
      /* track.synth = SampleLibrary.load({
        instruments: "piano",
      }).toDestination();*/
      track.synth = new Tone.PolySynth().toDestination();
    } else {
      /* track.synth = SampleLibrary.load({
        instruments: "piano",
      }).toDestination();*/
      track.synth = new Tone.PolySynth().toDestination();
    }

    track.notes.forEach((note) => {
      note.trackIndex = trackIndex;
      note.isSing = false;
    });

     synth = new Tone.Synth().toDestination();

  });

  Tone.Transport.bpm.value = 120;

  const noteArray = jsonMidiToArray(midi);

  const part = new Tone.Part((time, value) => {
    const t = Tone.now() - realTime;
    // document.getElementById("time").innerHTML = t;

   /* value.track.synth.triggerAttackRelease(
      value.note,
      value.duration,
      time,
      value.velocity
    );*/
  }, noteArray).start(0);

  console.log(noteArray);

  scheduler = Tone.Transport.scheduleRepeat((time) => {
    const t = Tone.now() - realTime;
    //realTime = one.now() - realTime;
    document.getElementById("timeRangeValue").innerHTML = parseFloat(t);
    document.getElementById("timeRange").value = parseFloat(t);

    midi.tracks.forEach((track, trackIndex) => {
      track.notes.forEach((value, noteIndex) => {

          synth.triggerAttackRelease(
            value.note,
            value.duration,
            time.reakTime,
            value.velocity
          );
        });
      });

          
    Tone.Draw.schedule(function () {
      //drawAll()
    }, time); //use AudioContext time of the event
  }, "8n");

  Tone.start();
}

setInterval((e) => {
  document.getElementById("toneTime").innerHTML = Tone.now();
  if (isPlaying) document.getElementById("time").innerHTML = Tone.now() - realTime;

  notesToSend = calculeNotesToDisplay();

  if (socket != null && socket.readyState !== WebSocket.CLOSED) {
    sendNotesToNeopixel(notesToSend);
  }
}, 200);

f2();

async function start() {
  Tone.start()
  Tone.Transport.start();

  realTime = Tone.now() - realTime;
  document.getElementById("time").innerHTML = Tone.now() - realTime;
  isPlaying = true;

}

function stop() {
  realTime = Tone.now() - realTime;
  isPlaying = false;
  Tone.Transport.stop();
}
function reset() {
  realTime = 0;
  isPlaying = false;
  Tone.Transport.stop();
  document.getElementById("time").innerHTML = 0;
}

function setup() {
  createCanvas(1400, 800);
}

function draw() {
  if (!midi) return;
  drawAll(notesToSend);
}
