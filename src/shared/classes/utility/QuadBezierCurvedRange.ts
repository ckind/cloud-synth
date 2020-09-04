/*

Parameteric Quadratic Bezier Equation

  x(t) = (1 - t)^2*x0 + 2t*(1 - t)*x1 + t^2*x2
  y(t) = (1 - t)^2*y0 + 2t*(1 - t)*y1 + t^2*y2

Equations for getting curved value

  (x0, y0) = (0, min)   // start
  (x1, y1) = (max, 0)   // control point
  (x2, y2) = (max, max) // end

  t = (x - min) / (max - min)

  curved value = y(t) = (1 - t)^2*y0 + 2t*(1 - t)*y1 + t^2*y2

*/

import { BaseCurvedRange } from "./BaseCurvedRange";
import { solveQuadratic } from "./MathHelpers";

interface Point {
  x: number;
  y: number;
}

export class QuadBezierCurvedRange extends BaseCurvedRange {
  private p: Array<Point>;
  private range: number;

  constructor(min: number, max: number) {
    super(min, max);
    this.range = max - min;
    this.p = new Array<Point>(3);
    this.p[0] = { x: 0, y: 0 };
    this.p[1] = { x: this.range, y: 0 }; // todo: make this adjustable
    this.p[2] = { x: this.range, y: this.range };
  }

  getCurvedValue(linearValue: number): number {
    this.validateInput(linearValue);
    // calculate t
    const t = (linearValue - this.min) / (this.max - this.min);
    // get value along bezier interpolation using t
    // y(t) = (y0 - 2y1 + y2)t^2 + 2(y1 + y0)t + y0
    let y = 
      (this.p[0].y - 2*this.p[1].y + this.p[2].y) * Math.pow(t, 2) + 
      2 * (this.p[1].y + this.p[0].y ) * t + 
      this.p[0].y;
    y += this.min;
    return y;
  }

  getLinearValue(curvedValue: number): number {
    this.validateInput(curvedValue);
    // y(t) = (1 - t)^2*y0 + 2t*(1 - t)*y1 + t^2*y2
    // y(t) = (y0 - 2y1 + y2)t^2 + 2(y1 + y0)t + y0 
    // 0    = (y0 - 2y1 + y2)t^2 + 2(y1 + y0)t + (y0 - y(t));
    // solve for t
    const yt = curvedValue - this.min;
    const a = this.p[0].y - 2*(this.p[1].y) + this.p[2].y;
    const b = 2 * (this.p[1].y + this.p[0].y);
    const c = this.p[0].y - yt;
    const solution = solveQuadratic(a, b, c);
    if (solution.solution1.imaginaryPart != 0 || solution.solution2.imaginaryPart != 0) {
      throw "invalid bezier curve - quadratic solution is not real";
    }
    // we only care about the positive solution
    const t = solution.solution1.realPart < 0
      ? solution.solution2.realPart
      : solution.solution1.realPart;
    // get value along linear interpolation using t
    const y = this.min + t * (this.max - this.min);
    return y;
  }

}