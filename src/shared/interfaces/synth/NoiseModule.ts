import { IAudioModule } from './IAudioModule';

export type NoiseType = "white" | "pink" | "brown";

export interface NoiseModule extends IAudioModule {

  type: NoiseType; 

}