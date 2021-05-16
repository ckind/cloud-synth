// scales are defined in terms of semi-tones from a given root

export enum ScaleType {
  Chromatic,
  // diatonic
  Ionian,
  Dorian,
  Phrygian,
  Lydian,
  Mixolydian,
  Aeolian,
  Locrian,
  // jazz minor
  MelodicMinorAscending,
  Dorianb2,
  LydianAugmented,
  LydianDominant,
  Mixolydianb6,
  HalfDiminished,
  Altered,
  // harmonic minor
  HarmonicMinor,
  // misc
  WholeTone,
  Blues,
  // octatonic
  HalfWhole,
  WholeHalf
}

export enum KeySignature {
  C = 0,
  CSharp = 1,
  DFlat = 1,
  D = 2,
  DSharp = 3,
  EFlat = 3,
  E = 4,
  F = 5,
  FSharp = 6,
  GFlat = 6,
  G = 7,
  GSharp = 8,
  AFlat = 8,
  A = 9,
  ASharp = 10,
  BFlat = 10,
  B = 11
}

// { label: "D#", note: 4 },
//       { label: "E", note: 5 },
//       { label: "F", note: 6 },
//       { label: "F#", note: 7 },
//       { label: "G", note: 8 },
//       { label: "G#", note: 9 },
//       { label: "A", note: 10 },
//       { label: "Bb", note: 11 },
//       { label: "B", note: 12 }

const scales = [
  // chromatic
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
  // diatonic
  [0, 2, 4, 5, 7, 9, 11],
  [0, 2, 3, 5, 7, 9, 10],
  [0, 1, 3, 5, 7, 8, 10],
  [0, 2, 4, 6, 7, 9, 11],
  [0, 2, 4, 5, 7, 9, 10],
  [0, 2, 3, 5, 7, 8, 10],
  [0, 1, 3, 5, 6, 8, 10],

  // jazz minor
  [0, 2, 3, 5, 7, 9, 11],
  [0, 1, 3, 5, 7, 9, 10],
  [0, 2, 4, 6, 8, 9, 11],
  [0, 2, 4, 6, 7, 9, 10],
  [0, 2, 4, 5, 7, 8, 10],
  [0, 2, 3, 5, 6, 8, 10],
  [0, 1, 3, 4, 6, 8, 10],
  
  // harmonic minor
  [0, 2, 3, 5, 7, 8, 11],
  // todo: harmonic minor modes...

  // misc
  [0, 2, 4, 6, 8, 10],
  [0, 3, 5, 6, 7, 10],

  // octatonic
  [0, 1, 3, 4, 6, 7, 9, 10],
  [0, 2, 3, 5, 6, 8, 9, 11]
];

// function GetMode(scale, degree) {
//     let
// };

export function getScale(scaleType: ScaleType, key = 1) {
  return scales[scaleType].map(n => (n + key) % 12);
}

export function quantizePitch(pitch: number, scale: number[]) {
  const octave = Math.floor(pitch / 12);
  const note = pitch % 12;
  console.log(pitch, octave, note, scale);
  let quantizedNote = note;
  let diff = 9000;
  for (let i = 0; i < scale.length; i++) {
    // favor higher pitch
    if (Math.abs(note - scale[i]) < diff && scale[i] > quantizedNote) {
      diff = Math.abs(note - scale[i]);
      quantizedNote = scale[i];
    }
  }
  // return pitch;
  return quantizedNote + 12 * octave;
}
