import { IDeviceContainer } from "./IDeviceContainer";
import { IMidiDevice } from "../devices/IMidiDevice";

export interface IMidiDeviceContainer extends IDeviceContainer {
  device: IMidiDevice;
}