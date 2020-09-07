import { AudioModule } from '../AudioModule';

export type NoiseType = "white" | "pink" | "brown";

export interface NoiseModule extends AudioModule {

  type: NoiseType; 

}