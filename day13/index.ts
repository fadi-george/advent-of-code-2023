import { readInput, transposeGrid } from "../helpers";

const dir = import.meta.dir;
const lines = readInput(dir, "\n\n");

const grids: string[][][] = [];
lines.map((line) => {
  const grid = line.split("\n").map((r) => r.split(""));
  grids.push(grid);
});

// part 1
const findSymmetry = (grid: string[][], target: number) => {
  for (let c = 1; c < grid[0].length; c++) {
    let wrongCount = 0;
    let lOffset = 0;
    let rOffset = 0;

    while (1) {
      let right: string | undefined;
      let left: string | undefined;

      for (let r = 0; r < grid.length; r++) {
        right = grid[r][c + rOffset];
        left = grid[r][c - 1 - lOffset];

        if (!right || !left) break;
        if (right != left) wrongCount++;
      }

      if (wrongCount > target || !right || !left) break;
      lOffset++;
      rOffset++;
    }

    if (wrongCount === target) return c;
  }
  return null;
};

const summarize = (grids: string[][][], target: number) => {
  return grids.reduce((acc, grid) => {
    const v = findSymmetry(grid, target) ?? 0;
    const tGrid = transposeGrid(grid);
    const h = findSymmetry(tGrid, target) ?? 0;

    return acc + v + h * 100;
  }, 0);
};

console.log("Part 1: ", summarize(grids, 0));

// part 2
console.log("Part 1: ", summarize(grids, 1));
