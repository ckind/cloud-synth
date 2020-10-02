/* 
    chords, notes and scales are represented by integers following the MIDI standard,
    with concert C = 0 + 12*octave, Db = 1 + 12*octave, etc...
*/

/*
    chord tone constants
*/

const ChordTones = {
  Roots: {
    C: { name: 'C', value: 0 },
    Cs: { name: 'C#', value: 1 },
    Db: { name: 'Db', value: 1 },
    D: { name: 'D', value: 2 },
    Ds: { name: 'D#', value: 3 },
    Eb: { name: 'Eb', value: 3 },
    E: { name: 'E', value: 4 },
    F: { name: 'F', value: 5 },
    Fs: { name: 'F#', value: 6 },
    Gb: { name: 'Gb', value: 6 },
    G: { name: 'G', value: 7 },
    Gs: { name: 'G#', value: 8 },
    Ab: { name: 'Ab', value: 8 },
    A: { name: 'A', value: 9 },
    Bb: { name: 'Bb', value: 10 },
    B: { name: 'B', value: 11 },
  },
  Triads: {
    Diminished: { name: 'dim', value: [0, 3, 6] },
    Minor: { name: 'm', value: [0, 3, 7] },
    Major: { name: '', value: [0, 4, 7] },
    Augmented: { name: 'aug', value: [0, 4, 8] },
  },
  SeventhChords: {
    // tertian
    Diminished7: { name: 'dim7', value: [0, 3, 6, 9] },
    HalfDiminished7: { name: 'm7b5', value: [0, 3, 6, 10] },
    Minor7: { name: 'm7', value: [0, 3, 7, 10] },
    Dominant7: { name: '7', value: [0, 4, 7, 10] },
    Major7: { name: 'M7', value: [0, 4, 7, 11] },
    AugmentedM7: { name: 'M7#5', value: [0, 4, 8, 11] },
    MinorM7: { name: 'mM7', value: [0, 3, 7, 11] },
    // non-tertian
    Augmented7: { name: 'mM7', value: [0, 3, 7, 11] },
    DiminishedM7: { name: 'dimM7', value: [0, 3, 7, 11] },
    Dominant7b5: { name: '7b5', value: [0, 3, 7, 11] },
    Major7b5: { name: 'M7b5', value: [0, 3, 7, 11] },
  },
  Extensions: {
    Nineths: {
      Minor: { name: 'b9', value: 13 },
      Major: { name: '9', value: 14 },
      Augmented: { name: '#9', value: 15 },
    },
    Elevenths: {
      Diminished: { name: 'b11', value: 16 },
      Perfect: { name: '11', value: 17 },
      Augmented: { name: '#11', value: 18 },
    },
    Thirteenths: {
      Minor: { name: 'b13', value: 20 },
      Major: { name: '13', value: 21 },
      Augmented: { name: '#13', value: 22 },
    }
  }
}

const voiceSum = (v) => { return v.notes.reduce((acc, v) => acc + v); };
const voiceWidth = (v) => {
  let min = Number.MAX_SAFE_INTEGER;
  let max = 0;
  for (const n of v.notes) {
    if (n > max) max = n;
    if (n < min) min = n;
  }
  return max - min;
}
voiceWidth({ notes: [0, 1] });

class Chord {
  // constructor args:
  //      root        -- ChordTones.Roots
  //      quality     -- ChordTones.Triads OR ChordTones.Sevenths
  //      extenstions -- array of ChordTones.Extensions
  constructor(root, quality, extensions = []) {
    const intervals = [...quality.value, ...extensions.map((x) => x.value)];
    this.notes = intervals.map((x) => (x + root.value) % 12);
    this.name = `${root.name}${quality.name}${extensions.map((x) => `(${x.name})`).join('')}`;
  }

  // gets all possible chord voicings within the given range
  getVoicings(lowerLimit, upperLimit, ascending, rootless = false) {
    rootless;
    const voicings = [];
    this.getVoicingsRec(lowerLimit, upperLimit, [], voicings);
    voicings.sort((x, y) => {
      const a = voiceSum(x);
      const b = voiceSum(y);
      if (ascending) {
        return a === b ? 0 : (a > b ? 1 : -1);
      } else {
        return a === b ? 0 : (a < b ? 1 : -1);
      }
    });
    return voicings;
  }

  getVoicingsRec(lowerLimit, upperLimit, voicing, voicings) {
    // depth first
    if (voicing.length === this.notes.length) {
      voicings.push({ notes: voicing });
    }
    let partialVoicing;
    let n = this.notes[voicing.length];
    while (n <= upperLimit) {
      if (n >= lowerLimit && n <= upperLimit) {
        partialVoicing = voicing.filter(() => true);
        partialVoicing.push(n);
        this.getVoicingsRec(lowerLimit, upperLimit, partialVoicing, voicings);
      }
      n += 12;
    }
  }
}

export { Chord, ChordTones };