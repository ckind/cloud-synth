export interface CurvedRange {

  min: number;

  max: number;

  getCurvedValue(linearValue: number): number;

  getLinearValue(curvedValue: number): number;

}