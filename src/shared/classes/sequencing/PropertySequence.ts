import { ScaleType } from "@/musicTheory/scales";

export interface DirectionOption {
	label: string;
	nextStepFunction: SequencerAdvanceFunction;
}

export interface ScaleOption {
	label: string;
	scale: ScaleType;
}

export interface TransposeOption {
	label: string;
	note: number;
}

export interface Step {
	note: number;
	octave: number;
	velocity: number;
	length: number;
	gate: boolean;
}

export class PropertySequence<T> {
	public steps: T[];
	public length: number;
	public currentStep: number;
	public direction: DirectionOption;
	public pingPongForward: boolean;

	constructor(_steps: T[], _length: number, _direction: DirectionOption) {
		this.steps = _steps;
		this.length = _length;
		this.direction = _direction;
		this.currentStep = this.steps.length - 1;
		this.pingPongForward = true;
	}

	getNextValue(): T {
		this.currentStep = this.direction.nextStepFunction(this);
		return this.steps[this.currentStep];
	}
}

export type SequencerAdvanceFunction = (sequence: PropertySequence<any>) => number;

export function getNextStepForward(sequence: PropertySequence<any>): number {
	return sequence.currentStep + 1 >= sequence.length
		? 0
		: sequence.currentStep + 1;
}

export function getNextStepReverse(sequence: PropertySequence<any>): number {
	return sequence.currentStep - 1 < 0
		? sequence.length - 1
		: sequence.currentStep - 1;
}

export function getNextStepPingPong(sequence: PropertySequence<any>): number {
	if (sequence.pingPongForward) {
		if (sequence.currentStep >= sequence.length - 1) {
			sequence.pingPongForward = false;
			return getNextStepReverse(sequence);
		} else {
			return getNextStepForward(sequence);
		}
	} else {
		if (sequence.currentStep <= 0) {
			sequence.pingPongForward = true;
			return getNextStepForward(sequence);
		} else {
			return getNextStepReverse(sequence);
		}
	}
}

export function getNextStepRandom(sequence: PropertySequence<any>): number {
	return Math.floor(Math.random() * sequence.length);
}