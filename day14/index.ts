import { printGrid, readInput, rotateRight } from "../helpers";

const dir = import.meta.dir;
const lines = readInput(dir);

const grid: string[][] = [];
lines.map((line, i) => {
  grid[i] = line.split("");
});

// part 1
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

// part 2
let g2 = structuredClone(grid);

const mapGridToKey = (g: string[][]) =>
  g
    .flatMap((row, r) =>
      row.map((cell, c) => (cell === "O" ? r * g[0].length + c : null))
    )
    .filter((ind) => ind !== null)
    .join(",");

const seen: Record<string, number> = {};
let cI = 0;
let lim = 1000000000;

while (cI < lim) {
  for (let i = 0; i < 4; i++) {
    slide(g2);
    g2 = rotateRight(g2);
  }
  const key = mapGridToKey(g2);
  const cycle = seen[key];
  if (cycle) {
    const rem = (lim - cI) % (cI - cycle);
    lim = cI + rem;
  }
  seen[key] = cI;
  cI++;
}

console.log("Part 2: ", countRoundedRocks(g2));
