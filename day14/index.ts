import { printGrid, readInput, transposeGrid } from "../helpers";

const dir = import.meta.dir;
const lines = readInput(dir);

const grid: string[][] = [];
lines.map((line, i) => {
  grid[i] = line.split("");
});

// part 1
// printGrid(grid);
const slide = (g: string[][]) => {
  const h = g.length;
  const w = g[0].length;

  for (let r = 0; r < h; r++) {
    for (let c = 0; c < w; c++) {
      if (g[r][c] === "O") {
        let blocked = false;

        let i = 0;
        while (!blocked) {
          if (g[r - i - 1]?.[c] === ".") {
            g[r - i - 1][c] = "O";
            g[r - i][c] = ".";
          } else {
            blocked = true;
            break;
          }
          i++;
        }
      }
    }
  }
};

// const cycle = (g: string[][]) => {
//   slide(g);
//   transposeGrid(g);
// };

const countRoundedRocks = (g: string[][]) =>
  g.reduce(
    (acc, row, rI) =>
      acc +
      (g.length - rI) * row.reduce((acc, v) => acc + (v === "O" ? 1 : 0), 0),
    0
  );

const g1 = structuredClone(grid);
slide(g1);
console.log("Part 1: ", countRoundedRocks(g1));

// // printGrid(grid);
// // part 2
// cycle(grid);
// printGrid();
