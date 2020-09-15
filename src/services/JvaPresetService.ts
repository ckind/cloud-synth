import { IPresetService } from "../shared/interfaces/presets/IPresetService";
import { IPresetBank } from "../shared/interfaces/presets/IPresetBank";
import { getDefaultJvaBank } from "../assets/presets/LocalDefaults";

export class JvaPresetService implements IPresetService {

  constructor() {
    //
  }

  // todo: replace with api call
  getFactoryBank(): Promise<IPresetBank> {
    return Promise.resolve(getDefaultJvaBank());
  }
}