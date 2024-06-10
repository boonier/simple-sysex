// Enable WEBMIDI.js and trigger the onEnabled() function when ready
import { WebMidi } from "./node_modules/webmidi/dist/esm/webmidi.esm.min";

WebMidi.enable({ sysex: true })
  .then(onEnabled)
  .catch((err) => alert(err));

// Function triggered when WEBMIDI.js is ready
function onEnabled() {
  const ioContainer = document.querySelector(".io");

  // Display available MIDI input devices
  if (WebMidi.inputs.length < 1) {
    ioContainer.innerHTML += "No device detected.";
  } else {
    ioContainer.innerHTML += `<h2>MIDI Inputs</h2>`;
    WebMidi.inputs.forEach((device, index) => {
      ioContainer.innerHTML += `${index === WebMidi.inputs.length - 1 ? `${index}: ${device.name} <br><br>` : `${index}: ${device.name} <br>`}`;
    });
    ioContainer.innerHTML += `<h2>MIDI Outputs</h2>`;
    WebMidi.outputs.forEach((device, index) => {
      ioContainer.innerHTML += `${index}: ${device.name} <br>`;
    });
  }
}

const cutoffSlider = document.getElementById("cutoff");
const cutoffVal = document.getElementById("cutoff-val");

cutoffSlider.addEventListener("input", (ev) => {
  let val = ev.target.value;
  console.log(val.toString(16));
  createSysexString(ev.target.value);
  cutoffVal.value = ev.target.value;
});

const progNum = document.getElementById("prog-num");
progNum.addEventListener("input", (ev) => {
  let val = ev.target.value;

  sendProgramChange(2, val - 1);
});

const sendProgramChange = (device, val) => {
  // WebMidi.outputs[device].sendSysex(0x41, [0xC2, val]);
  WebMidi.outputs[device].sendProgramChange(val);
};

// causes checksum errors
// for checksum calculation reference:
// https://www.vguitarforums.com/smf/index.php?topic=20544.0

const createSysexString = (device, val) => {
  // F0 41 10 6A 12 03 00 10 51 06 16 F7
  WebMidi.outputs[device].sendSysex(0x41, [
    0x10,
    0x6a,
    0x12,
    0x03,
    0x00,
    0x10,
    0x51,
    val.toString(16),
    0x16,
  ]);
  WebMidi.outputs[device].sendSysex(0x41, [
    0x10,
    0x6a,
    0x12,
    0x03,
    0x00,
    0x12,
    0x51,
    val.toString(16),
    0x16,
  ]);
  WebMidi.outputs[device].sendSysex(0x41, [
    0x10,
    0x6a,
    0x12,
    0x03,
    0x00,
    0x14,
    0x51,
    val.toString(16),
    0x16,
  ]);
};
