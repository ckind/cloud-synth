import { useAudioDevice } from "./useAudioDevice";
import { Gain as ToneGain } from "tone";

export function useEffectsDevice<TSettings extends Record<string, any>>(
  deviceName: string,
  _settings: TSettings
  ) {
  const { guid, name, settings, output } = useAudioDevice<TSettings>(deviceName, _settings);

  const input = new ToneGain(1);

  return {
    guid,
    name,
    settings,
    output,
    input
  }
}