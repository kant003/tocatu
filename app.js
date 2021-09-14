document.getElementById("connect").addEventListener("click", connect);
document.getElementById("disconnect").addEventListener("click", disconnect);

let noteSeparation = 15;
let offsetHorizontal = -294;
let offsetVertical = 360;
let noteHeight = 100;
let noteWidth = 10;
let brightness = 47;
let separation = 2; // cuanto tiempo (segundos) representa el modulo de neopixel en vertical
let a = 200
let b = 0.5
let showLeds = true;
let showPartiture = true;

let socket = null;

let midi;

let notesToSend = [];
let bpm = 70
let part
async function f2() {
   //load a midi file in the browser
 //midi = await Midi.fromUrl("./midis/Faded.mid");
  console.log(midi)
  midi2 = await fetch("./midis/simple.json")
  midi = await midi2.json();
  loadInstruments();
  Tone.start()

  Tone.Transport.bpm.value = 120;

  const noteArray = jsonMidiToArray(midi);
  
  notesToSend = calculeNotesToDisplay();


    //************** Tell transport about bpm changes  ********************
/*
    for (let i=0; i < midi.header.tempos.length; i++) {
			Tone.Transport.bpm.setValueAtTime(midi.header.tempos[i].bpm, midi.header.tempos[i].ticks + "i")
        }  
*/
  Tone.Transport.PPQ = midi.header.ppq  //Pulses Per Quarter


  //************** Tell Transport about Time Signature changes  ********************
  for (let i=0; i < midi.header.timeSignatures.length; i++) {
      Tone.Transport.schedule(time=>{
          Tone.Transport.timeSignature = midi.header.timeSignatures[i].timeSignature;
      }, midi.header.timeSignatures[i].ticks + "i");    
  }

 //************** Tell Transport about bpm changes  ********************
 for (let i=0; i < midi.header.tempos.length; i++) {
  Tone.Transport.schedule(time=>{
      //Tone.Transport.bpm.value = midi.header.tempos[i].bpm + bpm;
      //console.log('cambia tempo',midi.header.tempos[i].bpm+bpm)
  }, midi.header.tempos[i].ticks + "i");    
}

   /*part = new Tone.Part((time, note) => {
    let instrumentIndex = midi.tracks[note.trackIndex].instrument.number
    let synth = getSynths(instrumentIndex)
    synth.triggerAttackRelease(
      note.note,
      note.duration,
      time,
      note.velocity
    );
    document.getElementById("time").innerHTML = Tone.Transport.seconds

  }, noteArray).start(0);
*/


  for (let i = 0; i < midi.tracks.length; i++) {

    let instrumentIndex = midi.tracks[i].instrument.number
    let synth = getSynths(instrumentIndex)

    part = new Tone.Part(function(time,value){
      synth.triggerAttackRelease(value.name, value.duration, time, value.velocity)
    },midi.tracks[i].notes).start()                  
}  

  console.log(noteArray);

  const scheduler = Tone.Transport.scheduleRepeat((time) => {
    document.getElementById("timeRangeValue").innerHTML = parseFloat(Tone.Transport.position);
    document.getElementById("timeRange").value = parseFloat(Tone.Transport.position);

    document.getElementById("time").innerHTML = Tone.Transport.seconds

    notesToSend = calculeNotesToDisplay();

    if (socket != null && socket.readyState !== WebSocket.CLOSED) {
      sendNotesToNeopixel(notesToSend);
    }

  }, "16n");

}



f2();

async function start() {
  Tone.start()

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



function keyToNoteFrecuency(key){
  switch (key) {
    case "q": return 30
    case "w": return 31
    case "e": return 32
    case "r": return 33
    case "t": return 34
    case "y": return 35
    case "u": return 36
    case "i": return 37
    case "o": return 38
    case "p": return 39
    case "a": return 40
    case "s": return 41
    case "d": return 42
    case "f": return 43
    case "g": return 44
    case "h": return 45
    case "j": return 46
    case "k": return 47
    case "l": return 48
    case "ñ": return 49
    case "z": return 50
    case "x": return 51
    case "c": return 52
    case "v": return 53
    case "b": return 54
    case "n": return 55
    case "m": return 56
    case ",": return 57
    default: return 40    
  }
}


// handles keyboard events
document.addEventListener("keydown", e => {
  //let trackIndex = midi.tracks[note.trackIndex].instrument.number
  let synth = getSynths(0)
  let noteNumber = parseInt(keyToNoteFrecuency(e.key))+15;

  const noteName = Tone.Frequency(noteNumber, "midi").toNote();
  let info={
        "duration": 1,
        "durationTicks": 173,
        "midi": noteNumber,
        "name": noteName,
        "ticks": 192,
        "time": Tone.Transport.seconds,
        "velocity": 0.5
    }
  midi.tracks[0].notes.push(info)
  //part.value=midi.tracks[0].notes

  part.add(info);
  //synth.triggerAttackRelease(noteNumber, 1);
 //console.log(noteNumber)
  //const data = { r: 255, g: 0, b: 0, row: 0, col: noteNumber, midi: noteNumber, timeOffset: Tone.Transport.seconds  }
  //notesToSend.push(data)

});
