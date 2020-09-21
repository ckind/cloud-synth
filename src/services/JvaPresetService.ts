import { IPresetService } from "../shared/interfaces/presets/IPresetService";
import { IPresetBank } from "../shared/interfaces/presets/IPresetBank";
import { getDefaultJvaBank } from "./LocalDefaults";

export class JvaPresetService implements IPresetService {

  constructor() {
    //
  }

  getFactoryBank(): Promise<IPresetBank> {
    // todo: replace with api call
    return Promise.resolve(getDefaultJvaBank());
  }

  getLocalBank(): IPresetBank {
    return getDefaultJvaBank();
  }
}