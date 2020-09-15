import { IPresetService } from "../shared/interfaces/presets/IPresetService";
import { IPresetBank } from "../shared/interfaces/presets/IPresetBank";
import { getDefaultComputerMidiKeyboardBank } from "../assets/presets/LocalDefaults";

export class ComputerMidiKeyboardPresetService implements IPresetService {

  constructor() {
    //
  }

  // todo: replace with api call
  getFactoryBank(): Promise<IPresetBank> {
    return Promise.resolve(getDefaultComputerMidiKeyboardBank());
  }
}