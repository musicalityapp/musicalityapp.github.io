//next thing to do is add more gui keys
//note about the logic. everything is +0.05 because the array represents a "visually linear piano"

/*
  The original 12x12 `arr` matrix only worked for a single octave, because
  `notesOrderhm` mapped a *note name* ("C", "C#", ...) to a semitone index
  0-11. With 24 keys, ids have to be unique ("C1", "C#1", "C2", "C#2", ...),
  and there are now TWO keys that share the same pitch class (e.g. C1 and C2).
  A 12x12 lookup table can't tell those apart, and hand-writing a 24x24
  version of that table would just be the same arithmetic pattern typed out
  by hand.

  So instead of a matrix, each key id is converted straight into an absolute
  semitone number (0-23), and the interval between two keys is just the
  absolute difference between their semitone numbers. That distance is then
  turned into the same "0", "0.5", "1" ... style keys the original
  intervalshm already used, so the label lookup logic barely changes.
*/

const noteOrder = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

// turns "C1", "C#1", "A#2", etc into an absolute semitone index (0-23)
function noteIndex(id) {
  const octave = parseInt(id.slice(-1), 10);      // last char = octave number (1 or 2)
  const note = id.slice(0, -1);                   // everything else = note name
  const pitchClass = noteOrder.indexOf(note);      // 0-11
  return pitchClass + (octave - 1) * 12;           // 0-23
}

let intervalshm = new Map();
intervalshm.set("0", "|");
intervalshm.set("0.5", "2m");
intervalshm.set("1", "2M");
intervalshm.set("1.5", "3m");
intervalshm.set("2", "3M");
intervalshm.set("2.5", "4p");
intervalshm.set("3", "tri");
intervalshm.set("3.5", "5p");
intervalshm.set("4", "6m");
intervalshm.set("4.5", "6M");
intervalshm.set("5", "7m");
intervalshm.set("5.5", "7M");
intervalshm.set("6", "8");   // full octave (12 semitones)

function getIntervalDistance(curButtonPressedId, otherButtonId) {
  const curIndex = noteIndex(curButtonPressedId);
  const otherIndex = noteIndex(otherButtonId);
  const semitoneDistance = Math.abs(curIndex - otherIndex);

  // more than a full octave away (9ths, 10ths, etc) -> show nothing
  if (semitoneDistance > 12) {
    return "";
  }

  const key = (semitoneDistance * 0.5).toString();
  return intervalshm.get(key);
}

//let str = getIntervalDistance("C1", "C#1");   //example
//console.log(str + "<<<<<<<<<<<<<<<<<<<<<<<<<<<<<");  //test

const buttons = document.querySelectorAll('button.key');
buttons.forEach(button => {
  button.addEventListener('mousedown', function() {
    this.classList.add('pressed');
    //console.log(this.id);  //cur btn pressed test

    buttons.forEach(b => {
      //console.log("arguments (" + this.id + "  "+ b.id + ") = " + getIntervalDistance(this.id, b.id));  //debug
      const label = getIntervalDistance(this.id, b.id);
      b.innerHTML = label ? `<span>${label}</span>` : '';
    });
  });
  button.addEventListener('mouseup', function() {
    this.classList.remove('pressed');
    buttons.forEach(b => {
      b.innerHTML = '';
    });
  });
  button.addEventListener('mouseleave', function() {
    this.classList.remove('pressed');
    buttons.forEach(b => {
      b.innerHTML = '';
    });
  });
});
