export interface IDisposable {
  // cleans up any handlers and/or unmanaged resources
  dispose(): void;
}