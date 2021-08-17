const columnsToRigthSkip = [34, 37, 41, 43, 46, 49, 52, 55];
const columnsToLeftSkip = [28, 25, 22, 19, 16, 13, 11, 8];

function sendNotesToNeopixel(notesToSend) {
  let tempNotes = [...notesToSend];

  var test = new Uint8Array(tempNotes.length * 5);
  tempNotes.forEach((note, noteIndex) => {
    if (note.row < 0 || note.row > 16) return;
    if (
      note.col < 0 + 29 + columnsToLeftSkip.length ||
      note.col > 63 + 29 - columnsToRigthSkip.length
    )
      return;

    const rigthSkipsNum = columnsToRigthSkip.filter(
      (n) => n <= note.col - 29
    ).length;
    const leftSkipsNum = columnsToLeftSkip.filter(
      (n) => n >= note.col - 29
    ).length;
    let { dispNumber, numPix } = rowcolToNeopixel(
      parseInt(note.row),
      parseInt(note.col) - 29 - leftSkipsNum + rigthSkipsNum
    );
    test[noteIndex * 5] = dispNumber; // 0, 1, 2 o 3
    test[noteIndex * 5 + 1] = Math.round(numPix);
    test[noteIndex * 5 + 2] = parseInt(note.r);
    test[noteIndex * 5 + 3] = parseInt(note.g);
    test[noteIndex * 5 + 4] = parseInt(note.b);
  });
  socket.send(test);
}

function rowcolToNeopixel(row, col) {
  let numPix = 0;
  let dispNumber = 0;
  if (col <= 31) {
    // sector izquierdo
    if (row > 7) {
      // sector superior
      dispNumber = 0;
    } else {
      // sector inferior
      dispNumber = 3;
    }
    numPix = row % 2 === 0 ? -col + 31 + 32 * row : col + 32 * row;
  } else {
    // sector derecho
    if (row > 7) {
      // sector superior
      dispNumber = 1;
    } else {
      // sector inferior
      dispNumber = 2;
    }
    numPix = 224 - row * 32;
    numPix = row % 2 === 0 ? numPix + 31 + 32 - col : numPix + col - 32;
  }
  dispNumber = parseInt(dispNumber);
  numPix = parseInt(numPix);
  return { dispNumber, numPix };
}

function sendChangeBrightness(brightness){
  const test = new Uint8Array(10);
  const order = 255
  test[0]=order// 255 is for change de brightness
  test[1]=brightness
  test[2]=0
  test[3]=0
  test[4]=0

  socket.send(test);
}

function connect() {
  console.log("Intentando conectar...");
  const url = document.getElementById("url").value;
  socket = new WebSocket(url);

  socket.onopen = function (e) {
    console.log("[open] Conexión establecida");
  };

  socket.onmessage = function (event) {
    console.log(`[message] Datos recibidos del servidor: ${event.data}`);
  };

  socket.onclose = function (event) {
    if (event.wasClean) {
      console.log(
        `[close] Conexión cerrada limpiamente, código=${event.code} motivo=${event.reason}`
      );
    } else {
      // ej. El proceso del servidor se detuvo o la red está caída
      // event.code es usualmente 1006 en este caso
      console.log("[close] La conexión se cayó");
    }
  };

  socket.onerror = function (error) {
    console.error(`[error] ${error.message}`);
  };
}

function disconnect() {
  console.log("Intentando cerrar conexión...");
  socket.close();
}
