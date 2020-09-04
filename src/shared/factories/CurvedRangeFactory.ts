import { CurvedRange } from "../interfaces/utility/CurvedRange";
import { LinearCurvedRange } from "../classes/utility/LinearCurvedRange";
import { QuadBezierCurvedRange } from "../classes/utility/QuadBezierCurvedRange";
import { ExponentialCurvedRange } from "../classes/utility/ExponentialCurvedRange";

export type CurvedRangeType = "linear" | "exponential" | "quadratic bezier";

export class CurvedRangeFactory {

  static getCurvedRange(type: CurvedRangeType, min: number, max: number): CurvedRange {
    let curve: CurvedRange;
    switch (type) {
      case "linear":
        curve = new LinearCurvedRange(min, max);
        break;
      case "exponential":
        curve = new ExponentialCurvedRange(min, max);
        break;
      case "quadratic bezier":
        curve = new QuadBezierCurvedRange(min, max);
        break;
      default:
        throw "invalid CurvedRangeType argument";
    }
    return curve;
  }

}
