import { CurvedRange } from "../../interfaces/utility/CurvedRange";

export abstract class BaseCurvedRange implements CurvedRange {
  readonly min: number;
  readonly max: number;

  constructor(min: number, max: number) {
    this.min = min;
    this.max = max;
  }

  getCurvedValue(linearValue: number): number {
    throw "getCurvedValue must be overriden in child class";
  }

  getLinearValue(curvedValue: number): number {
    throw "getLinearValue must be overriden in child class";
  }

  protected validateInput(value: number) {
    if (value < this.min ) {
      throw `given value ${value} is less than min value ${this.min}`;
    } else if (value > this.max ) {
      throw `given value ${value} is greater than max value ${this.max}`;
    }
  }

}