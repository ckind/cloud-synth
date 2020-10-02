// scales are defined in terms of semi-tones from a given root

export const scales = {
  // chromatic
  chromatic: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],

  // diatonic
  ionian: [0, 2, 4, 5, 7, 9, 11],
  dorian: [0, 2, 3, 5, 7, 9, 10],
  phrygian: [0, 1, 3, 5, 7, 8, 10],
  lydian: [0, 2, 4, 6, 7, 9, 11],
  mixolydian: [0, 2, 4, 5, 7, 9, 10],
  aeolian: [0, 2, 3, 5, 7, 8, 10],
  locrian: [0, 1, 3, 5, 6, 8, 10],

  // jazz minor
  melodicMinorAsc: [0, 2, 3, 5, 7, 9, 11],
  dorianb2: [0, 1, 3, 5, 7, 9, 10],
  lydianAugmented: [0, 2, 4, 6, 8, 9, 11],
  lydianDominant: [0, 2, 4, 6, 7, 9, 10],
  mixolydianb6: [0, 2, 4, 5, 7, 8, 10],
  halfDiminished: [0, 2, 3, 5, 6, 8, 10],
  altered: [0, 1, 3, 4, 6, 8, 10],

  // harmonic minor
  harmonicMinor: [0, 2, 3, 5, 7, 8, 11],
  // todo: harmonic minor modes...

  // misc
  wholetone: [0, 2, 4, 6, 8, 10],
  blues: [0, 3, 5, 6, 7, 10],

  // octatonic
  halfWhole: [0, 1, 3, 4, 6, 7, 9, 10],
  wholeHalf: [0, 2, 3, 5, 6, 8, 9, 11]

}

// function GetMode(scale, degree) {
//     let
// };


export function quantizePitch(pitch: number, scale: number[]) {
  const octave = Math.floor(pitch / 12);
  const note = pitch % 12;
  let quantizedNote = note;
  let diff = 9000;
  // favor the higher pitch
  for (let i = scale.length - 1; i >= 0; i--) {
    if (Math.abs(note - scale[i]) < diff) {
      diff = Math.abs(note - scale[i]);
      quantizedNote = scale[i];
    }
  }
  return quantizedNote + 12 * octave;
}
