
function drawBackground() {
  background(220);
  stroke("black");
  line(10, offsetVertical, width - 10, offsetVertical);
}



function drawPartitura(midi) {
  if (midi === undefined) return;

  const t = isPlaying===true ?  (Tone.now() - realTime) : realTime
  stroke(0, 30);
  fill(0, 0, 0, 30);

  midi.tracks.forEach((track, trackIndex) => {
    track.notes.forEach((note, noteIndex) => {
      // Restrict numbers of notes no visibles
      if(note.time > t+3+1) return
      if(note.time < t-7) return
     
      rect(
        note.midi * noteSeparation + offsetHorizontal,
        (+t - note.time) * a + offsetVertical,
        noteWidth,
        -note.duration * a
      );

      //console.log(note.time)
    });
  });
}

function drawNameNotes() {
  fill("black");
  noStroke();
  textSize(8);
  for (let i = 21; i < 108; i++) {
    if(bemoles.includes(i))  fill('blue')
    else fill('black')
    if(i==60) fill('red')
    let v = i;
    text(v, v * noteSeparation + offsetHorizontal, 10);
    text(
      Tone.Frequency(v, "midi").toNote(),
      v * noteSeparation + offsetHorizontal,
      20
    );

  }
}
//a escala partitura
//b escala de representacion leds
function drawLeds() {
    noFill();
    stroke("black");
    const numRows  = 16
    for (let i = 21; i < 108; i++) {
      for (let j = 0; j <=15; j++) {
          const espace = separation//separation*15
      
          let x = (espace*j/15)  * b// convertimos los numeros del 0 al 15 a una escala de 0 a 0.2*15=3
          //console.log(x)
          rect(i * noteSeparation + offsetHorizontal, 
             - x *a  + offsetVertical, 
            noteWidth, 
            -10);
      }
    }
  }

  /**
   * 
   rect(
        note.midi * noteSeparation + offsetHorizontal,
        (+t - note.time) * noteHeight + offsetVertical,
        noteWidth,
        -note.duration * noteHeight
      );
   */


 function drawAll(notesToSend){

  drawBackground();
  if (showPartiture) drawPartitura(midi);
  drawNameNotes();
  if (showLeds) drawLeds();

  noStroke();
  notesToSend.forEach( (note, noteIndex) => {

    fill(note.r, note.g, note.b);
    rect(
      note.midi * noteSeparation + offsetHorizontal,
      -note.timeOffset * a  + offsetVertical  ,
      noteWidth,
     -10
    );
  })
}


function calculeNotesToDisplay(){

  listNotes = []

  //let ligthDistance = 0;
  //let ligthDistanceIncrement = separation;
  for(let i=0;i<=15;i++){
    
  listNotes = listNotes.concat(calculeNotesToDisplayAtTime(i) )
  // ligthDistance += ligthDistanceIncrement;
  }
  return listNotes
}


function calculeNotesToDisplayAtTime(i){
  const space = separation//separation*15

  let x = (space*i/15)  * b // convertimos los numeros del 0 al 15 a una escala de 0 a 0.2*15=3

  let listNotes = []
  const t = isPlaying===true ?  (Tone.now() - realTime) : realTime


  midi.tracks.forEach( (track,trackIndex) => {
    let notes = getNotesOfTime(t + x, trackIndex);
    notes.forEach((note, noteIndex) => {

      let c = calculeNoteColor(t, note, x, trackIndex);
     /* c.r = 255
      c.g=0
      c.b=0*/
    //const row = Math.round( (3*timeOffset)/0.2 )
    const row = Math.round( i )
    

    listNotes.push({r:c.r, g:c.g, b:c.b, row:row, col:note.midi, /*disp: dispNumber, numPix: numPix,*/ midi:note.midi, timeOffset:x} )
  });
  })
 return listNotes
}