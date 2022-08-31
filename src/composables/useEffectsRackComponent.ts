import { Ref, SetupContext, onMounted } from "vue";
import { ToneAudioNode } from "tone";

type TEffectsDeviceProxy = {
  guid: Ref<string>;
  name: Ref<string>;
  settings: any;
  input: ToneAudioNode;
  output: ToneAudioNode;
  applySettings: (settings: any) => void;
  dispose: () => void;
}

export function useEffectsRackComponent(
  context: SetupContext<any>,
  effectsDeviceProxy: TEffectsDeviceProxy
  ) {

  function deleteComponent() {
    context.emit("deleteComponent", effectsDeviceProxy);
  }

  function componentDragstart() {
    context.emit("componentDragstart", effectsDeviceProxy);
  }

  function componentDragend() {
    context.emit("componentDragend", effectsDeviceProxy);
  }

  function elementDropped() {
    context.emit("elementDropped", effectsDeviceProxy);
  }

  onMounted(() => {
    context.emit("effectsDeviceMounted", effectsDeviceProxy);
  });

  return {
    deleteComponent,
    componentDragstart,
    componentDragend,
    elementDropped
  }
}