import { IPresetService } from "../shared/interfaces/presets/IPresetService";
import { IPresetBank } from "../shared/interfaces/presets/IPresetBank";
import { getDefaultKeypadBank } from "./OfflinePresetService";

export class ExternalMidiPresetService implements IPresetService {

  constructor() {
    //
  }

  // todo: replace with api call
  getFactoryBank(): Promise<IPresetBank> {
    return Promise.resolve(getDefaultKeypadBank());
  }

  getLocalBank(): IPresetBank {
    return getDefaultKeypadBank();
  }
}