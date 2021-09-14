//let synths = []
let instruments = new Map();


function jsonMidiToArray(jsonMidi) {
    const noteArray = [];
    jsonMidi.tracks.forEach((track,trackIndex) => {
      const notes = track.notes;
      notes.forEach((note) => {
        let objectNote = {
          time: note.time,
          note: note.name,
          velocity: note.velocity,
          duration: note.duration,
          trackIndex: trackIndex
        };
        noteArray.push(objectNote);
      });
    });
    return noteArray;
  }


  function getNotesOfTime(time, numTrack) {
    let track = midi.tracks[numTrack];

    let notas = track.notes.filter(
      (n) => time >= n.time && time < n.time + n.duration
    );
    return notas;
  }


function getInstrument(midiInstrumentNumber) {
  switch (midiInstrumentNumber) {
    case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7: return 'piano'
    case 8: case 9: case 10: case 11: case 12: case 14: case 15: return 'bass-electric'
    case 22: return 'harmonium'
    case 13: return 'xylophone'
    case 16: case 17: case 18: case 19: case 20: case 21: case 23: return 'organ'
    case 24: return 'guitar-nylon'
    case 25: return 'guitar-acoustic'
    case 26: case 27: case 28: case 29: case 30: case 31: return 'guitar-electric'
    case 32: case 33: case 34: case 35: case 36: case 37: case 38: case 39: return 'bass-electric'
    case 40: case 41: return 'violin'
    case 42: return 'cello'
    case 43: return 'contrabass'
    case 44: case 45: case 47: return 'contrabass'
    case 46: return 'harp'
    case 56: case 59: return 'trumpet'
    case 57: return 'trombone'
    case 58: return 'tuba'
    case 60: case 69: return 'french-horn'
    case 70: return 'bassoon'
    case 71: return 'clarinet'
    case 72: case 73:  case 74: case 75: case 76: case 77: case 78: case 79: return 'flute'
    default: return 'piano'
  }
}

function loadInstruments(){


  midi.tracks.forEach(function(track) {
    const instrumentName = getInstrument(track.instrument.number)
    if( ! instruments.has(instrumentName) ){
      const synth = SampleLibrary.load({
        instruments: instrumentName,
      }).toDestination();
      instruments.set(instrumentName, synth)
    }
  })

}

function getSynths(instrumentNumber){
  let instrumentName = getInstrument(instrumentNumber)
  return instruments.get(instrumentName)
}




function calculeNotesToDisplay() {
  let listNotes = []

  for (let i = 0; i <= 15; i++) {
    listNotes = listNotes.concat(calculeNotesToDisplayAtTime(i))
  }
  return listNotes
}


function calculeNotesToDisplayAtTime(i) {
  const time = Tone.Transport.seconds
  //const space = separation//separation*15

  let x = (separation * i / 15) * b // convertimos los numeros del 0 al 15 a una escala de 0 a 0.2*15=3

  let listNotes = []

  midi.tracks.forEach((track, trackIndex) => {
    //if(trackIndex!=1) return
    const notes = getNotesOfTime(time + x, trackIndex);
    notes.forEach((note) => {

      const c = calculeNoteColor(time, note, x, trackIndex);
      const row = Math.round(i)
   //   console.log(note.midi)
      listNotes.push({ r: c.r, g: c.g, b: c.b, row: row, col: note.midi, timeOffset: x })
    });
  })
  return listNotes
}