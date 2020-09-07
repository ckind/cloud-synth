import { BaseCurvedRange } from "./BaseCurvedRange";

export class ExponentialCurvedRange extends BaseCurvedRange {
  private readonly range: number;
  private readonly logMin: number;
  private readonly logMax: number;
  private readonly logRange: number;

  constructor(min: number, max: number) {
    super(min, max);
    this.range = max - min;
    this.logMin = this.log2(min);
    this.logMax = this.log2(max);
    this.logRange = this.logMax - this.logMin;
  }

  private log2(x: number) {
    return Math.log(x) / Math.log(2);
  }

  private exp2(x: number) {
    return Math.pow(2, x);
  }

  getCurvedValue(value: number): number {
    this.validateInput(value);
    const t = (value - this.min) / this.range;
    const val = this.exp2(t * this.logRange + this.logMin);
    return val;
  }

  getLinearValue(value: number): number {
    this.validateInput(value);
    const t = (this.log2(value) - this.logMin) / this.logRange;
    const val = t * this.range + this.min;
    return val;
  }
}
