import { IVueInstrumentDevice } from "../interfaces/devices/IVueInstrumentDevice";
import JvaSynth from "../../components/JvaSynth.vue";

export type VueInstrumentDeviceType = "Jva Poly" | "Jva Drummachine";

export class VueInstrumentDeviceFactory {
  static getInstrumentDevice(type: VueInstrumentDeviceType): IVueInstrumentDevice {
    let device: IVueInstrumentDevice;
    switch (type) {
      case "Jva Poly":
        device = new JvaSynth();
        break;
      case "Jva Drummachine":
        device = new JvaSynth();
        break;
      default:
        throw "invalid VueInstrumentDeviceType argument";
    }
    return device;
  }
}
