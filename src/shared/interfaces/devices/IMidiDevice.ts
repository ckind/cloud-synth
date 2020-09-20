import { IMidiReceiver } from "../midi/IMidiReceiver";
import { IMidiSender } from "../midi/IMidiSender";
import { IDisposable } from '../utility/IDisposable';
import { IDevice } from "./IDevice";

export interface IMidiDevice extends IMidiReceiver, IMidiSender, IDevice, IDisposable {}