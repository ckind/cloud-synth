import { useDevice } from "./useDevice";
import { Gain as ToneGain } from "tone";

export function useAudioDevice<TSettings extends Record<string, any>>(
  deviceName: string,
  _settings: TSettings
  ) {
  const { guid, name, settings } = useDevice<TSettings>(deviceName, _settings);

  const output = new ToneGain(1);

  return {
    guid,
    name,
    settings,
    output
  };
}