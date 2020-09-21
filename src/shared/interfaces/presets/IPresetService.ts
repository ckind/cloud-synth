import { IPresetBank } from "./IPresetBank";

export interface IPresetService {
  getFactoryBank(): Promise<IPresetBank>;
  getLocalBank(): IPresetBank;
}