import { IAudioModule } from "../synth/IAudioModule";
import { IAudioInputModule } from "../synth/IAudioInputModule";
import { IDevice } from "./IDevice";
import { IDisposable } from "../utility/IDisposable";

export interface IEffectsDevice extends IAudioModule, IAudioInputModule, IDevice, IDisposable {}