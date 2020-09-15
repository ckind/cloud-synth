import { IAudioModule } from "../synth/IAudioModule";
import { IMidiReceiver } from "../midi/IMidiReceiver";
import { IDevice } from "./IDevice";

export interface IInstrumentDevice extends IAudioModule, IMidiReceiver, IDevice {}