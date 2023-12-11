import fs from "fs";
import path from "path";

Array.prototype.sum = function () {
  return this.reduce((a, b) => a + b, 0);
};
Array.prototype.product = function () {
  return this.reduce((a, b) => a * b, 1);
};

export const readInput = (dir: string, regex = "\n") => {
  return fs
    .readFileSync(
      path.join(dir, `${import.meta.env.input || "sample4"}.txt`),
      "utf8"
    )
    .split(regex);
};

// Greatest Common Divisor (GCD)
const gcd = (a: number, b: number) => {
  // Calculate the Greatest Common Divisor (GCD) using Euclid's algorithm
  while (b !== 0) {
    const temp = b;
    b = a % b;
    a = temp;
  }
  return a;
};

// Least Common Multiple (LCM)
export const lcm = (a: number, b: number) => {
  return (a * b) / gcd(a, b);
};

export const printGrid = (grid: any[][]) => {
  grid.forEach((row) => {
    console.log(row.join(""));
  });
};

type Matrix<T> = T[][];
export const floodFill = <T>(
  matrix: Matrix<T>,
  startX: number,
  startY: number,
  value: T[],
  newValue: T
): Matrix<T> => {
  const numRows = matrix.length;
  if (numRows === 0) return matrix;

  const numCols = matrix[0].length;
  const startValue = matrix[startX][startY];

  function isValid(x: number, y: number): boolean {
    return (
      x >= 0 &&
      x < numRows &&
      y >= 0 &&
      y < numCols &&
      value.includes(matrix[x][y])
    );
  }

  function fill(x: number, y: number): void {
    if (!isValid(x, y)) {
      return;
    }

    matrix[x][y] = newValue;

    fill(x + 1, y);
    fill(x - 1, y);
    fill(x, y + 1);
    fill(x, y - 1);
  }

  if (startValue !== newValue) {
    fill(startX, startY);
  }

  return matrix;
};

export const printSetInds = <T>(grid: Matrix<T>, set: Set<number>) =>
  [...set].map((v) => [Math.floor(v / grid[0].length), v % grid[0].length]);
