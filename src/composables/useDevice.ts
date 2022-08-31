import { reactive, ref } from "vue";
import { v4 as uuidv4 } from "uuid";

export function useDevice<TSettings extends Record<string, any>>(
  deviceName: string,
  _settings: TSettings
  ) {
  const guid = ref(uuidv4());
  const name = ref(deviceName);
  const settings = reactive(_settings);

  return {
    guid,
    name,
    settings
  }
}