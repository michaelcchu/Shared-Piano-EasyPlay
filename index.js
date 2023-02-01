// ==UserScript==
// @name         Shared Piano EasyPlay
// @namespace    https://mcchu.com/
// @version      0.1
// @description  Play a track from a MIDI file on Shared Piano by pressing keys to play the next note.
// @author       Michael Chu
// @match        https://musiclab.chromeexperiments.com/Shared-Piano/
// @icon         https://www.google.com/s2/favicons?domain=chromeexperiments.com
// @grant        none
// @require      https://unpkg.com/@tonejs/midi
// ==/UserScript==

// Set some settings
const setting = document.querySelector('piano-settings');
setting.resizeMode = "manual";
setting.octaves = 7;

// Create reader
const reader = new FileReader();
let midi;

reader.onload = function(e) {
    midi = new Midi(e.target.result);
    console.log(midi);
}

// Create input
const fileInput = document.createElement('input');
fileInput.type = "file";
fileInput.accept = ".mid,.midi";
document.body.appendChild(fileInput);

fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];
    if (file) {reader.readAsArrayBuffer(file);}
});

// Declare variables
let activePress; let index; let notes; let normalGain; 
let octave; let press; let track; let tuning;
const value = {"c":0,"d":2,"e":4,"f":5,"g":7,"a":9,"b":11,"#":1,"&":-1};
let on = false;
let DOM_note;

// What to do when starting the program
function start() {
    resetVars();
    if (!on) {on = true;}

    // Get notes from Shared Piano keyboard
    const keyboard = document.querySelector("piano-keyboard");
    const octaves = keyboard.shadowRoot.querySelectorAll("piano-keyboard-octave");
    DOM_note = {};

    for (let i = 0; i < octaves.length; i++) {
        const notes = octaves[i].shadowRoot.querySelectorAll("piano-keyboard-note");
        for (let j = 0; j < notes.length; j++) {
            if (notes[j].note) {
                DOM_note[notes[j].note] = notes[j];
            }
        }
    }

    console.log(DOM_note);
}

function resetVars() {
    activePress = null; index = 0; 
    track = 0;
    notes = midi.tracks[track].notes.map(x => x.midi);
}

// Listen for user input
document.addEventListener("keydown", (e) => {
    if (e.key === "Enter") { start(); }
    if (e.key === 'm' && e.ctrlKey) { console.log("click"); fileInput.click(); }
});

const badKeys = ["Alt","Arrow","Audio","Enter","Launch","Meta","Play","Tab"];

function key(e) { 
    if (e.type.includes("key")) {press = e.key;} 
    else {press = e.changedTouches[0].identifier;}
    if (["keydown","touchstart"].includes(e.type)) {down(e);} else {up(e);}
}

function down(e) {
    const strPress = "" + press;
    if (on && !badKeys.some(badKey => strPress.includes(badKey))
        && (index < notes.length) && !e.repeat && (press != activePress)
        && (document.activeElement.nodeName !== 'INPUT')) {
        if (DOM_note[notes[index]]) {
            console.log(DOM_note[notes[index]].clicked);
            if (activePress === null) {
                DOM_note[notes[index]].clicked = true;
            } else {
                DOM_note[notes[index-1]].clicked = false;
                DOM_note[notes[index]].clicked = true;
            }
        }
        activePress = press; index++;
    }
}

function up(e) {
    if (on && (press === activePress)) {
        activePress = null;
        if (DOM_note[notes[index-1]]) {
            DOM_note[notes[index-1]].clicked = false;
        }
    }
}

const docEventTypes = ["keydown","keyup","touchstart","touchend"];
for (const et of docEventTypes) {document.addEventListener(et, key);}