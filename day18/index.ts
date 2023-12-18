import { createGrid, printGrid, readInput } from "../helpers";

const dir = import.meta.dir;
const lines = readInput(dir, "\n");

const ints: [string, number, string][] = [];

lines.forEach((line, ii) => {
  let [, dir, n, color] = line.match(/([A-Z]) (\d+) (\(.*\))/)!;
  ints.push([dir, +n, color]);
});

// determine grid size
let w = 1;
let h = 1;
let cR = 1; // row offset from top left corner
let cC = 1; // column offset from top left corner
let minC = Infinity;
let minR = Infinity;
for (let [d, n] of ints) {
  switch (d) {
    case "R":
      cR += n;
      if (cR > w) w = cR;
      break;
    case "L":
      cR -= n;
      if (cR < 0) w += -cR;
      break;
    case "D":
      cC += n;
      if (cC > h) h = cC;
      break;
    case "U":
      cC -= n;
      if (cC < 0) h += -cC;
      break;
  }
  if (cR < minR) minR = cR;
  if (cC < minC) minC = cC;
}

type Value = "#" | ".";
const grid = createGrid<Value>(w, h, ".");

// determine gid map
let r = 0 - minR + 1;
let c = 0 - minC + 1;
// for (let [d, n] of ints) {
//   switch (d) {
//     case "R":
//       for (let i = 0; i < n; i++) grid[r][c++] = "#";
//       break;
//     case "L":
//       for (let i = 0; i < n; i++) grid[r][c--] = "#";
//       break;
//     case "D":
//       for (let i = 0; i < n; i++) grid[r++][c] = "#";
//       break;
//     case "U":
//       for (let i = 0; i < n; i++) grid[r--][c] = "#";
//       break;
//   }
// }

// // count area
// // printGrid(grid);

// let area = 0;
// let inside = false;
// for (let r = 0; r < h; r++) {
//   inside = false;
//   for (let c = 0; c < w; c++) {
//     if (grid[r][c] === "#") {
//       if (c === 0 || grid[r][c - 1] !== "#") inside = !inside;
//       area += 1;
//     } else if (inside) {
//       area += 1;
//     }
//   }
// }

// // 1578559 wrong
// console.log(area);
