const noteNames = [
  "C",
  "Db",
  "D",
  "Eb",
  "E",
  "F",
  "Gb",
  "G",
  "Ab",
  "A",
  "Bb",
  "B"
];

export class MidiUtils {
  static NoteToText(n: number) {
    const octaveNum = Math.floor(n / 12) - 2;
    const note = noteNames[n % 12];
    return note + octaveNum.toString();
  }

  static ScaleToText(root: number, scale: Array<number>) {
    return scale.map((x: number) => {
      return MidiUtils.NoteToText(x + root);
    });
  }
}
