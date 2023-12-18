import {
  addBorderToGrid,
  createGrid,
  floodFill,
  floodFillStack,
  printGrid,
  readInput,
} from "../helpers";

const dir = import.meta.dir;
const lines = readInput(dir, "\n");

const ints: [string, number, string][] = [];

lines.forEach((line, ii) => {
  let [, dir, n, color] = line.match(/([A-Z]) (\d+) (\(.*\))/)!;
  ints.push([dir, +n, color]);
});

// determine grid size
let cR = 0;
let cC = 0;
let minC = Infinity;
let minR = Infinity;
let maxC = -Infinity;
let maxR = -Infinity;
for (let [d, n] of ints) {
  switch (d) {
    case "R":
      cC += n;
      break;
    case "L":
      cC -= n;
      break;
    case "D":
      cR += n;
      break;
    case "U":
      cR -= n;
      break;
  }

  if (cR < minR) minR = cR;
  if (cC < minC) minC = cC;
  if (cR > maxR) maxR = cR;
  if (cC > maxC) maxC = cC;
}
let w = maxC - minC + 1;
let h = maxR - minR + 1;

type Value = "#" | ".";
const grid = createGrid<Value>(w, h, ".");

// determine gid map
let r = Math.abs(minR);
let c = Math.abs(minC);
for (let [d, n] of ints) {
  switch (d) {
    case "R":
      for (let i = 0; i < n; i++) grid[r][++c] = "#";
      break;
    case "L":
      for (let i = 0; i < n; i++) grid[r][--c] = "#";
      break;
    case "D":
      for (let i = 0; i < n; i++) grid[++r][c] = "#";
      break;
    case "U":
      for (let i = 0; i < n; i++) grid[--r][c] = "#";
      break;
  }
}

// count area
const g2 = addBorderToGrid<Value | "/">(grid, ".");
floodFillStack(g2, 0, 0, ["."], "/");

w += 2;
h += 2;
let area = 0;
for (let r = 0; r < h; r++) {
  for (let c = 0; c < w; c++) {
    if (g2[r][c] !== "/") {
      area++;
    }
  }
}
console.log("Part 1: ", area);
