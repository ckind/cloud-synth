import { BaseCurvedRange } from "./BaseCurvedRange";

export class ExponentialCurvedRange extends BaseCurvedRange {
  private readonly valueRange: number;
  private readonly scaledRange: number;
  private readonly scaledMin: number;
  private readonly scaledMax: number;

  constructor(min: number, max: number) {
    super(min, max);
    this.valueRange = max - min;
    this.scaledMin = this.scaleInput(min);
    this.scaledMax = this.scaleInput(max);
    this.scaledRange = this.scaledMax - this.scaledMin;
  }

  private scaleInput(x: number) {
    return Math.log(x) / Math.log(2);
  }

  private scaleOutput(x: number) {
    return Math.pow(2, x);
  }

  getCurvedValue(value: number): number { // todo: debug
    this.validateInput(value);
    const t = (this.scaleInput(value) - this.scaledMin) / this.scaledRange;
    const val = (t * this.valueRange + this.min);
    return val;
  }
}
