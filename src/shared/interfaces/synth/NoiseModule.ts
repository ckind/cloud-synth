import { RackModule } from '../RackModule';

export type NoiseType = "white" | "pink" | "brown";

export interface NoiseModule extends RackModule {

  type: NoiseType; 

}