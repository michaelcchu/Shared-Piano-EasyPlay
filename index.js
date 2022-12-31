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


const input = document.createElement('input');
input.type = "file";
input.accept = ".mid,.midi";
input.id = "notes";
document.body.appendChild(input);

const reader = new FileReader();

let midi; let notes;

reader.onload = function(e) {
    midi = new Midi(e.target.result);
    /*
    document.getElementById("viewTracks").innerHTML = "Tracks:";
    for (let i = 0; i < midi.tracks.length; i++) {
        let t = midi.tracks[i];
        document.getElementById("viewTracks").innerHTML += "<br>" + i + ": "
            + t.name;
    }*/
    console.log(midi);
}

input.addEventListener("change", () => {
    //resetVariables();
    console.log("yay");
    notes = document.getElementById("notes").files[0]; // change to input
    if (notes) {reader.readAsArrayBuffer(notes);}
});

function start() { }

document.addEventListener("keydown", (e) => {
    if (e.key === "Enter") { start(); }
    if (e.key === 'm' && e.ctrlKey) { console.log("click"); input.click(); }
});


console.log("hi");
