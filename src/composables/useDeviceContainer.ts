import { ref, Ref, computed, SetupContext, onMounted } from "vue";
import { PresetServiceFactory } from "@/shared/factories/PresetServiceFactory";
import { IPreset } from "../shared/interfaces/presets/IPreset";
import { IDevice } from "@/shared/interfaces/devices/IDevice";

export function useDeviceContainer(
  defaultDeviceName: string,
  deviceRefs: Array<Ref<IDevice | null>>,
  context: SetupContext<any>
  ) {
  
  let presetService = PresetServiceFactory.getPresetService(
    defaultDeviceName
  );

  const currentDeviceName = ref(defaultDeviceName);
  const currentBank = ref(presetService.getLocalBank());
  const currentPreset = ref(currentBank.value.categories[0].presets[0]);

  const device = computed(() => {
    return deviceRefs.find(d => d.value?.name === currentDeviceName.value)?.value;
  });

  async function loadFactoryPresets() {
    currentBank.value = await presetService.getFactoryBank();
    currentPreset.value = currentBank.value.categories[0].presets[0];
    device.value?.applySettings(currentPreset.value.settings);
  }

  function deviceSelected(deviceName: string) {
    if (currentDeviceName.value != deviceName) {
      currentDeviceName.value = deviceName;
      presetService = PresetServiceFactory.getPresetService(
        currentDeviceName.value
      );
      currentBank.value = presetService.getLocalBank();
      currentPreset.value = currentBank.value.categories[0].presets[0];
    }
  }

  function newDeviceMounted() {
    console.log(deviceRefs.map(d => d.value?.name));
    
    loadFactoryPresets().then(() => {
      console.log(
        `loaded ${device.value?.name} preset bank ${currentBank.value._id}`
      );
    });
    context.emit("newDeviceMounted", device.value);
    
    console.log(`mounted device ${device.value?.name}`);
  }

  function downloadCurrentSettings() {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(device.value?.settings));
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "savedPreset.json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }

  function uploadSettings() {
    const input = document.querySelector("#uploadSettingsInput") as HTMLElement;
    input.click();
  }

  function applyCustomSettings(e: Event) {
    const input = e.target as HTMLInputElement;
    if (!input.files) return;
    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const jsonSettings = e.target!.result as string;
      device.value?.applySettings(JSON.parse(jsonSettings));
      currentPreset.value = {
        name: file.name,
        version: 0,
        private: true,
        settings: device.value?.settings ?? {},
      };
    };
    reader.readAsText(file);
  }

  function presetSelected(p: IPreset) {
    currentPreset.value = p;
    device.value?.applySettings(p.settings);
  }

  onMounted(() => {
    device.value?.applySettings(currentPreset.value.settings);
  });

	return {
    currentDeviceName,
    currentBank,
    currentPreset,
    device,
    loadFactoryPresets,
    deviceSelected,
    newDeviceMounted,
    downloadCurrentSettings,
    uploadSettings,
    applyCustomSettings,
    presetSelected
	}
}