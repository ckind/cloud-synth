import { IEffectsDevice } from "@/shared/interfaces/devices/IEffectsDevice";
import { ToneAudioNode, Gain as ToneGain, Destination as ToneDestination } from "tone";

export default class EffectsChain {
  public components: IEffectsDevice[];
  public input: ToneGain;
  public output: ToneGain;

  constructor() {
    this.components = [];

    this.input = new ToneGain(1);
    this.output = new ToneGain(1);

    this.input.connect(this.output);
  }

  addComponent(component: IEffectsDevice, index: number) {
    if (index < 0 || index > this.components.length)
      throw "effects component index out of range";

    const prevNode: ToneAudioNode =
      index === 0 ? this.input : this.components[index - 1].output;
    const nextNode: ToneAudioNode =
      index === this.components.length
        ? this.output
        : this.components[index].input;
        
    // todo: is this necessary?
    ToneDestination.mute = true; //  mute while connecting in case of glitches

    prevNode.disconnect(nextNode);
    prevNode.connect(component.input); //
    component.output.connect(nextNode); 

    this.components.splice(index, 0, component);

    ToneDestination.mute = false;
  }

  removeComponent(component: IEffectsDevice) {
    const index = this.components.findIndex((c) => c.guid === component.guid);

    if (index < 0) throw "component not found in chain";

    this.removeComponentByIndex(index);
  }

  removeComponentByIndex(index: number) {
    const prevNode: ToneAudioNode =
      index === 0 ? this.input : this.components[index - 1].output;
    const nextNode: ToneAudioNode =
      index === this.components.length - 1
        ? this.output
        : this.components[index + 1].input;

    prevNode.disconnect(this.components[index].input);
    this.components[index].output.disconnect(nextNode);
    prevNode.connect(nextNode);

    this.components.splice(index, 1);
  }

  dispose() {
    this.input.disconnect(this.components[0].input);
    this.components[this.components.length - 1].output.disconnect(this.output);

    for (let i = 0; i < this.components.length - 1; i++) {
      this.components[i].output.disconnect();
      this.components[i].dispose();
    }

    this.input.dispose();
    this.output.dispose();
  }
}