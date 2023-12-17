import fs from "fs";
import path from "path";

export { AStar, type Position } from "./aStar";

Array.prototype.sum = function () {
  return this.reduce((a, b) => a + b, 0);
};
Array.prototype.product = function () {
  return this.reduce((a, b) => a * b, 1);
};

export const readInput = (dir: string, regex = "\n") => {
  return fs
    .readFileSync(
      path.join(dir, `${import.meta.env.input || "sample"}.txt`),
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

export const printGrid = (grid: any[][], joinCh = "") => {
  grid.forEach((row) => {
    console.log(row.join(joinCh));
  });
  console.log("\n");
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

export const indexToPos = <T>(grid: Matrix<T>, r: number, c: number) =>
  r * grid[0].length + c;

export const posToIndices = <T>(grid: Matrix<T>, set: Set<number> | string[]) =>
  [...set].map((v) => [Math.floor(+v / grid[0].length), +v % grid[0].length]);

export const arraysEqual = (a: any[], b: any[]) => {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length != b.length) return false;
  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
};

export const transposeGrid = <T>(grid: T[][]): T[][] => {
  const rows = grid.length;
  const columns = grid[0].length;

  // Create a new grid with swapped rows and columns
  const transposedGrid: T[][] = [];
  for (let i = 0; i < columns; i++) {
    transposedGrid[i] = [];
    for (let j = 0; j < rows; j++) {
      transposedGrid[i][j] = grid[j][i];
    }
  }

  return transposedGrid;
};

export const rotateLeft = <T>(grid: T[][]): T[][] =>
  new Array(grid[0].length)
    .fill([])
    .map((_, i) => grid.map((row) => row[grid[0].length - 1 - i]));

export const rotateRight = <T>(g: T[][]) =>
  g[0].map((_, i) => g.map((r) => r[i]).reverse());

export const getSurrounding = <T>(r: number, c: number) => [
  [r - 1, c - 1], // top left
  [r - 1, c], // top
  [r - 1, c + 1], // top right
  [r, c - 1], // left
  [r, c + 1], // right
  [r + 1, c - 1], // bottom left
  [r + 1, c], // bottom
  [r + 1, c + 1], // bottom right
];

export const addBorderToGrid = <T>(grid: T[][], borderValue: T): T[][] => {
  const rows = grid.length;
  const columns = grid[0].length;

  // Create a new grid with an added border
  const borderedGrid: T[][] = new Array(rows + 2)
    .fill([])
    .map(() => new Array(columns + 2).fill(borderValue));

  // Copy the original grid to the center of the new grid
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      borderedGrid[i + 1][j + 1] = grid[i][j];
    }
  }

  return borderedGrid;
};
