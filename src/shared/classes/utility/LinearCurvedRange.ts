import { BaseCurvedRange } from "./BaseCurvedRange";

export class LinearCurvedRange extends BaseCurvedRange {

  constructor(min: number, max: number) {
    super(min, max);
  }

  getCurvedValue(value: number): number {
    this.validateInput(value);
    return value;
  }

  getLinearValue(value: number): number {
    this.validateInput(value);
    return value;
  }
}
