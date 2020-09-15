import { IDeviceContainer } from "./IDeviceContainer";
import { IInstrumentDevice } from "../devices/IInstrumentDevice";

export interface IInstrumentContainer extends IDeviceContainer {
  device: IInstrumentDevice;
}