interface QuadraticResult {
  solution1: QuadraticRoot;
  solution2: QuadraticRoot;
}

interface QuadraticRoot {
  realPart: number;
  imaginaryPart: number; // 0 means the the number is real
}

export function solveQuadratic(a: number,  b: number, c: number): QuadraticResult {
  const root1 = { realPart: 0, imaginaryPart: 0 };
  const root2 = { realPart: 0, imaginaryPart: 0 };
  const discriminant = b * b - 4 * a * c;
  // condition for real and different roots
  if (discriminant > 0) {
    root1.realPart = (-b + Math.sqrt(discriminant)) / (2 * a);
    root2.realPart = (-b - Math.sqrt(discriminant)) / (2 * a);
  }
  // condition for real and equal roots
  else if (discriminant == 0) {
    root1.realPart = root2.realPart = -b / (2 * a);
  }
  // if roots are not real
  else {
    const realPart = (-b / (2 * a));
    const imagPart = (Math.sqrt(-discriminant) / (2 * a));
    root1.realPart = realPart;
    root1.imaginaryPart = imagPart;
    root2.realPart = realPart;
    root2.imaginaryPart = -imagPart;
  }
  return { solution1: root1, solution2: root2 };
}
