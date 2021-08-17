document.getElementById("start").addEventListener("click", start);
document.getElementById("stop").addEventListener("click", stop);
document.getElementById("reset").addEventListener("click", reset);
document
  .getElementById("timeRange")
  .addEventListener("input", timeRangeChange);
document
  .getElementById("noteSeparationRange")
  .addEventListener("input", noteSeparationRangeChange);
document
  .getElementById("offsetHorizontalRange")
  .addEventListener("input", offsetHorizontalRangeChange);
document
  .getElementById("offsetVerticalRange")
  .addEventListener("input", offsetVerticalRangeChange);
document
  .getElementById("noteHeightRange")
  .addEventListener("input", noteHeightRangeChange);
document
  .getElementById("noteWidthRange")
  .addEventListener("input", noteWidthRangeChange);
document
  .getElementById("brightnessRange")
  .addEventListener("input", brightnessRangeChange);
document
  .getElementById("separationRange")
  .addEventListener("input", separationRangeChange);
document
  .getElementById("aRange")
  .addEventListener("input", aRangeChange);
document
  .getElementById("bRange")
  .addEventListener("input", bRangeChange);
document
  .getElementById("bpmRange")
  .addEventListener("input", bpmRangeChange);
document
  .getElementById("showLeds")
  .addEventListener("change", showLedsChange);
document
  .getElementById("showPartiture")
  .addEventListener("change", showPartitureChange);



function timeRangeChange(e) {
  const value = parseFloat(e.target.value);
  document.getElementById("timeRangeValue").innerHTML = value.toFixed(4) + "s";

  Tone.Transport.start(undefined, value);
  Tone.Transport.pause();
  

}

function noteSeparationRangeChange(e) {
  document.getElementById("noteSeparationRangeValue").innerHTML =
    e.target.value;
  noteSeparation = parseFloat(e.target.value);
}

function offsetHorizontalRangeChange(e) {
  document.getElementById("offsetHorizontalRangeValue").innerHTML =
    e.target.value;
  offsetHorizontal = parseFloat(e.target.value);
}

function offsetVerticalRangeChange(e) {
  document.getElementById("offsetVerticalRangeValue").innerHTML =
    e.target.value;
  offsetVertical = parseFloat(e.target.value);
}

function noteHeightRangeChange(e) {
  document.getElementById("noteHeightRangeValue").innerHTML =
    e.target.value;
  noteHeight = parseFloat(e.target.value);
}

function noteWidthRangeChange(e) {
  document.getElementById("noteWidthRangeValue").innerHTML =
    e.target.value;
  noteWidth = parseFloat(e.target.value);
}

function separationRangeChange(e) {
  document.getElementById("separationRangeValue").innerHTML =
    e.target.value;
  separation = parseFloat(e.target.value);
}

function aRangeChange(e) {
  document.getElementById("aRangeValue").innerHTML =
    e.target.value;
  a = parseFloat(e.target.value);
}
function bRangeChange(e) {
  document.getElementById("bRangeValue").innerHTML =
    e.target.value;
  b = parseFloat(e.target.value);
}
function bpmRangeChange(e) {
  document.getElementById("bpmRangeValue").innerHTML =
    e.target.value;
  bpm = parseFloat(e.target.value);
  Tone.Transport.bpm.value = bpm
  console.log(bmp)
}


function brightnessRangeChange(e) {
  document.getElementById("brightnessRangeValue").innerHTML =
    e.target.value;
  brightness = parseFloat(e.target.value);


  sendChangeBrightness(brightness);
}


function showLedsChange() {
  showLeds = !showLeds

}
function showPartitureChange() {
  showPartiture = !showPartiture
}