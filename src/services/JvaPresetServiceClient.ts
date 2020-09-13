import { IJvaSettings } from "@/IJvaSettings";
import axios from "axios";

export interface IJvaPresetServiceClient {
  getDefaultPreset(): Promise<IJvaSettings>;
}

class JvaPresetServiceClient implements IJvaPresetServiceClient {
  constructor() {
    // nothing yet
  }

  async getDefaultPreset(): Promise<IJvaSettings> {
    const res = await axios.get(`${process.env.VUE_APP_PRESET_API_URL}/jva/default`);
    return res.data.settings;
  }
}

export const getJvaPresetServiceClient = (): IJvaPresetServiceClient => {
  return new JvaPresetServiceClient();
};
