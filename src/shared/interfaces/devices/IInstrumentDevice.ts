import { IAudioModule } from "../synth/IAudioModule";
import { IMidiReceiver } from "../midi/IMidiReceiver";
import { IDevice } from "./IDevice";
import { IDisposable } from "../utility/IDisposable";

export interface IInstrumentDevice extends IAudioModule, IMidiReceiver, IDevice, IDisposable {}