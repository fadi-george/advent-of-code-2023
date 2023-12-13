import { readInput } from "../helpers";

const dir = import.meta.dir;
const lines = readInput(dir, "\n\n");

const grids: string[][][] = [];
lines.map((line, rI) => {
  const grid = line.split("\n").map((r) => r.split(""));
  grids.push(grid);
});

const findVerticalSymmetry = (grid: string[][]) => {
  const w = grid[0].length;
  const h = grid.length;
  let leftOffset = 0;
  let rightOffset = 0;

  const symPairs: [number, number][] = [];

  for (let c = 1; c < w; c++) {
    let valid = true;
    leftOffset = 0;
    rightOffset = 0;

    while (1) {
      let right: string | undefined;
      let left: string | undefined;

      for (let r = 0; r < h; r++) {
        right = grid[r][c + rightOffset];
        left = grid[r][c - 1 - leftOffset];

        if (!right || !left) break;
        if (right != left) {
          valid = false;
          break;
        }
      }

      if (!right || !left) break;
      leftOffset++;
      rightOffset++;
    }

    if (valid) {
      // shift by 1
      symPairs.push([c, c + 1]);
    }
  }

  return symPairs;
};

const findHorizontalSymmetry = (grid: string[][]) => {
  const w = grid[0].length;
  const h = grid.length;
  let bottomOffset = 0;
  let topOffset = 0;

  const symPairs: [number, number][] = [];

  for (let r = 1; r < h; r++) {
    let valid = true;
    bottomOffset = 0;
    topOffset = 0;

    while (1) {
      let top: string | undefined;
      let bottom: string | undefined;

      for (let c = 0; c < w; c++) {
        top = grid[r - 1 - topOffset]?.[c];
        bottom = grid[r + bottomOffset]?.[c];

        if (!top || !bottom) break;
        if (top != bottom) {
          valid = false;
          break;
        }
      }

      if (!top || !bottom) break;
      topOffset++;
      bottomOffset++;
    }

    if (valid) {
      // shift by 1
      symPairs.push([r, r + 1]);
    }
  }

  return symPairs;
};

const summarize = (grids: string[][][]) => {
  return grids.reduce((acc, grid) => {
    const v = findVerticalSymmetry(grid);
    const h = findHorizontalSymmetry(grid);
    let score = 0;

    if (v.length > 0) score += v.reduce((acc, [c]) => acc + c, 0);
    if (h.length > 0) score += h.reduce((acc, [r]) => acc + r * 100, 0);
    return acc + score;
  }, 0);
};

console.log("Part 1: ", summarize(grids));
