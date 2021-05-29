import { SignalMixer } from "../../interfaces/utility/SignalMixer";
import { Gain, ToneAudioNode, immediate } from "tone";

declare type GainChannel = Gain | null;

export class GainMixer implements SignalMixer {
  readonly output: Gain;
  readonly channels: Array<GainChannel>;

  constructor(numChannels: number) {
    this.output = new Gain(1);
    this.channels = new Array<GainChannel>(numChannels);
    this.channels.fill(null);
  }

  dispose() {
    this.channels.forEach(channel => {
      if (channel) {
        channel.disconnect(this.output);
        channel.dispose();
      }
    });

    this.output.dispose();
  }

  addInput(n: number, input: ToneAudioNode) {
    if (this.channels[n] !== null) {
      throw `channel ${n} already taken`;
    } else {
      const channelGain = new Gain(0);
      input.connect(channelGain);
      channelGain.connect(this.output);
      this.channels[n] = channelGain;
    }
  }

  removeInput(n: number) {
    throw "removeInput not implemented!";
  }

  channel(n: number) {
    if (this.channels[n] === null) {
      throw `channel ${n} is unassigned`;
    } else {
      const channel = this.channels[n] as Gain;
      return channel;
    }
  }

  balance() {
    let balancedGain: number;
    const activeChannels = this.channels.filter(c => c !== null);
    if (activeChannels.length > 0) {
      balancedGain = 1.0 / activeChannels.length;
    }
    activeChannels.forEach(c => {
      c?.gain.setValueAtTime(balancedGain, immediate());
    });
  }
}
