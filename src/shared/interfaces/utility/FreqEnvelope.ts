export interface FreqEnvelope {

  attack: number;

  decay: number;

  sustain: number;

  release: number;

  baseFrequency: number;

  amount: number;

  triggerAttack(time?: number): this;

  triggerRelease(time?: number): this;
  
  cancel(time?: number): this;

  dispose(): this;

}