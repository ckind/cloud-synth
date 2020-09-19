export interface IDevice {
  name: string;
  settings: Object;
  applySettings(settings: Object): void;
}