import { IPresetService } from "../interfaces/presets/IPresetService";
import { JvaPresetService } from "../../services/JvaPresetService";
import { KeypadPresetService } from "../../services/KeypadPresetService";

export class PresetServiceFactory {
  static getPresetService(type: string): IPresetService {
    let service: IPresetService;
    switch (type) {
      case "Jva Poly":
        service = new JvaPresetService();
        break;
      case "Computer Keyboard":
        service = new KeypadPresetService();
        break;
      case "External":
        service = new KeypadPresetService(); // todo: implement
        break;
      case "Step Sequencer":
        service = new KeypadPresetService(); // todo: implement
        break;
      case "Effects Rack":
        service = new KeypadPresetService(); // todo: implement
        break;
      case "Piano":
        service = new KeypadPresetService(); // todo: implement
        break;
      default:
        throw "invalid preset service type argument";
    }
    return service;
  }
}
