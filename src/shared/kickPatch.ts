import Tone from "tone";

// this is a good kick patch
const env = new Tone.Envelope();
env.attack = 0.0001;
env.decay = 0.2;
env.sustain = 0.0;
env.release = 0.1;

const env2 = new Tone.Envelope();
env2.attack = 0.0001;
env2.decay = 0.1;
env2.sustain = 1.0;
env2.release = 1.0;

const g = new Tone.Gain(200);
const s = new Tone.Scale(50, 500);

const filter = new Tone.Filter();
filter.type = "lowpass";
filter.rolloff = -24;
filter.Q.value = 2;
filter.frequency.value = 50;

const amp = new Tone.Gain(0);

const dist = new Tone.Distortion(0.4);

const osc = new Tone.Oscillator(50, "square").chain(filter, amp, Tone.Master);
filter.chain(dist, amp, Tone.Master);

env.chain(s, filter.frequency);
env.chain(g, osc.frequency);
env2.connect(amp.gain);

osc.start();

// env.triggerAttackRelease(0.01);
// env2.triggerAttackRelease(0.01);
