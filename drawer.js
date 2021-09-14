
function drawBackground() {
  background(220);
  stroke("black");
  line(10, offsetVertical, width - 10, offsetVertical);
}


// Print on screen all notes of partiture
function drawPartitura(midi) {
  if (midi === undefined) return;

  const time = Tone.Transport.seconds
  stroke(0, 30);
  fill(0, 0, 0, 30);

  midi.tracks.forEach((track) => {
    track.notes.forEach((note) => {
      // Skip no visible notes
      if (note.time > time + 3 + 1) return
      if (note.time < time - 7) return

      rect(
        note.midi * noteSeparation + offsetHorizontal,
        (time - note.time) * a + offsetVertical,
        noteWidth,
        -note.duration * a
      );

    });
  });
}

// Print on screen all note names of piano
function drawNameNotes() {
  const DO_Central = 60
  const initNote = 21
  const finalNote = 108

  fill("black");
  noStroke();
  textSize(8);

  for (let i = initNote; i < finalNote; i++) {
    if (bemoles.includes(i)) fill('blue')
    else fill('black')
    if (i === DO_Central) fill('red')
    text(i, i * noteSeparation + offsetHorizontal, 10);
    text(
      Tone.Frequency(i, "midi").toNote(),
      i * noteSeparation + offsetHorizontal,
      20
    );
  }
}

//a escala partitura
//b escala de representacion leds
// Print on screen a neopixel representation
function drawLeds() {
  noFill();
  stroke("black");
  const numRows = 16
  for (let i = 21; i < 108; i++) {
    for (let j = 0; j <= 15; j++) {
      const espace = separation//separation*15

      let x = (espace * j / 15) * b// convertimos los numeros del 0 al 15 a una escala de 0 a 0.2*15=3
      rect(i * noteSeparation + offsetHorizontal,
        - x * a + offsetVertical,
        noteWidth,
        -10);
    }
  }
}



function drawAll(notesToSend) {

  drawBackground();
  if (showPartiture) drawPartitura(midi);
  drawNameNotes();
  if (showLeds) drawLeds();

  noStroke();
  notesToSend.forEach((note) => {

    fill(note.r, note.g, note.b);
    rect(
      note.col * noteSeparation + offsetHorizontal,
      -note.timeOffset * a + offsetVertical,
      noteWidth,
      -10
    );
  })
}

