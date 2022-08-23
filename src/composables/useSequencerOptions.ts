import { ref } from "vue";
import {
	DirectionOption,
	ScaleOption,
	TransposeOption,
	getNextStepForward,
	getNextStepReverse,
	getNextStepPingPong,
	getNextStepRandom
} from "@/shared/classes/sequencing/PropertySequence";
import { ScaleType, KeySignature } from "@/musicTheory/scales";

export function useSequencerOptions() {

	const directionOptions = ref([
		{ label: "forward", nextStepFunction: getNextStepForward },
		{ label: "reverse", nextStepFunction: getNextStepReverse },
		{ label: "ping pong", nextStepFunction: getNextStepPingPong },
		{ label: "random", nextStepFunction: getNextStepRandom },
	] as DirectionOption[]);

	const scaleOptions = ref([
		{ label: "chromatic", scale: ScaleType.Chromatic },
		{ label: "major", scale: ScaleType.Ionian },
		{ label: "minor", scale: ScaleType.Aeolian },
		{ label: "dorian", scale: ScaleType.Dorian },
		{ label: "phrygian", scale: ScaleType.Phrygian },
		{ label: "lydian", scale: ScaleType.Lydian },
		{ label: "mixolydian", scale: ScaleType.Mixolydian },
		{ label: "locrian", scale: ScaleType.Locrian },
		{ label: "harm. minor", scale: ScaleType.HarmonicMinor },
		{ label: "blues", scale: ScaleType.Blues }
	] as ScaleOption[]);

	const transposeOptions = ref([
		{ label: "C", note: KeySignature.C },
		{ label: "C#", note: KeySignature.CSharp },
		{ label: "D", note: KeySignature.D },
		{ label: "D#", note: KeySignature.DSharp },
		{ label: "E", note: KeySignature.E },
		{ label: "F", note: KeySignature.F },
		{ label: "F#", note: KeySignature.FSharp },
		{ label: "G", note: KeySignature.G },
		{ label: "G#", note: KeySignature.GSharp },
		{ label: "A", note: KeySignature.A },
		{ label: "Bb", note: KeySignature.BFlat },
		{ label: "B", note: KeySignature.B },
	] as TransposeOption[]);

	return {
		directionOptions,
		scaleOptions,
		transposeOptions
	}
}