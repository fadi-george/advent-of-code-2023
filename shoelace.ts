type Point = { x: number; y: number };

export function shoelaceFormula(polygon: Point[]): number {
  let area = 0;

  // Calculate the sum of the cross products.
  for (let i = 0; i < polygon.length; i++) {
    let j = (i + 1) % polygon.length; // Ensures the last vertex connects back to the first

    area += polygon[i].x * polygon[j].y - polygon[j].x * polygon[i].y;
  }

  // The area is half of the absolute value of the sum.
  return Math.abs(area) / 2;
}
