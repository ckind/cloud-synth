export interface IDevice {
  guid: string;
  name: string;
  settings: Object;
  applySettings(settings: Object): void;
}