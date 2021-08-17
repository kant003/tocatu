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