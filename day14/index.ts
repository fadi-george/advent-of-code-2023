import {
  printGrid,
  readInput,
  reverseTransposeGrid,
  transposeGrid,
} from "../helpers";

const dir = import.meta.dir;
const lines = readInput(dir);

const grid: string[][] = [];
lines.map((line, i) => {
  grid[i] = line.split("");
});

// part 1
// printGrid(grid);
const slideUp = (g: string[][]) => {
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

const slideLeft = (g: string[][]) => {
  const h = g.length;
  const w = g[0].length;

  for (let r = 0; r < h; r++) {
    for (let c = 0; c < w; c++) {
      if (g[r][c] === "O") {
        let blocked = false;

        let i = 0;
        while (!blocked) {
          if (g[r][c - i - 1] === ".") {
            g[r][c - i - 1] = "O";
            g[r][c - i] = ".";
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

const slideDown = (g: string[][]) => {
  const h = g.length;
  const w = g[0].length;

  for (let r = h - 1; r >= 0; r--) {
    for (let c = 0; c < w; c++) {
      if (g[r][c] === "O") {
        let blocked = false;

        let i = 0;
        while (!blocked) {
          if (g[r + i + 1]?.[c] === ".") {
            g[r + i + 1][c] = "O";
            g[r + i][c] = ".";
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

const slideRight = (g: string[][]) => {
  const h = g.length;
  const w = g[0].length;

  for (let r = 0; r < h; r++) {
    for (let c = w - 1; c >= 0; c--) {
      if (g[r][c] === "O") {
        let blocked = false;

        let i = 0;
        while (!blocked) {
          if (g[r][c + i + 1] === ".") {
            g[r][c + i + 1] = "O";
            g[r][c + i] = ".";
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
slideUp(g1);
console.log("Part 1: ", countRoundedRocks(g1));

// part 2
console.log("P2");
const visited = new Set<string>();

const mapGridToKey = (g: string[][]) => {
  const inds = [];
  for (let r = 0; r < g.length; r++) {
    for (let c = 0; c < g[0].length; c++) {
      if (g[r][c] === "O") {
        const ind = r * g[0].length + c;
        inds.push(ind);
      }
    }
  }

  return inds.join(",");
};

let g2 = structuredClone(grid);
printGrid(g2);

const seen: Record<string, number> = {};
let cI = 0;

let lim = 1000000000;
while (cI < lim) {
  slideUp(g2); // north
  slideLeft(g2); // west
  slideDown(g2); // south
  slideRight(g2); // east

  const key = mapGridToKey(g2);
  const cycle = seen[key];

  if (cycle) {
    const rem = (lim - cI) % (cI - cycle);
    lim = cI + rem;
  }

  seen[key] = cI;
  cI++;
}

printGrid(g2);
console.log("Part 2: ", countRoundedRocks(g2));
