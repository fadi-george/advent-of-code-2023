import assert from "assert";
import { indexToPos, printGrid, readInput } from "../helpers";

const grid: string[][] = [];
const sPos = [-1, -1];

const lines = readInput(import.meta.dir);
lines.forEach((line, rI) => {
  grid.push(line.split(""));
  if (line.includes("S")) {
    sPos[0] = rI;
    sPos[1] = line.indexOf("S");
  }
});

const dirs = [
  [-1, 0], // up
  [0, 1], // right
  [1, 0], // down
  [0, -1], // left
];

grid[sPos[0]][sPos[1]] = ".";
const countPlots = ({
  start,
  maxSteps,
}: {
  start: number[];
  maxSteps: number;
}) => {
  const q = [
    {
      pos: start,
      count: 0,
    },
  ];
  let visited = new Set<number>();
  let plots = new Set<number>();
  let mr = maxSteps & 1;
  let res = 0;

  while (q.length) {
    const { pos, count } = q.shift()!;
    const [r, c] = pos;
    const key = indexToPos(grid, r, c);

    if ((count & 1) === mr) {
      plots.add(key);
    }

    if (count >= maxSteps) {
      continue;
    }
    if (visited.has(key)) {
      continue;
    }
    visited.add(key);

    dirs.forEach(([dr, dc]) => {
      const [nr, nc] = [r + dr, c + dc];
      const v = grid[nr]?.[nc];

      if (v === ".") q.push({ pos: [nr, nc], count: count + 1 });
    });
  }

  return res + plots.size;
};

console.log("Part 1:", countPlots({ start: sPos, maxSteps: 64 }));

// part 2
// credit: HyperNeutrino
const size = grid.length;
assert(grid[0].length === grid.length);
assert(size >> 1 === sPos[0] && size >> 1 === sPos[1]);

const steps = 26501365;
assert(steps % size === size >> 1);

const [sr, sc] = sPos;
const gw = Math.floor(steps / size) - 1;

const odd = ((gw >> 1) * 2 + 1) ** 2;
const even = (((gw + 1) >> 1) * 2) ** 2;

const oddPoints = countPlots({ maxSteps: size * 2 + 1, start: sPos });
const evenPoints = countPlots({ maxSteps: size * 2, start: sPos });

// expand up
const edgeT = countPlots({ maxSteps: size - 1, start: [size - 1, sc] });

// expand rightwards
const edgeR = countPlots({
  maxSteps: size - 1,
  start: [sr, 0],
});

// expand down
const edgeB = countPlots({ maxSteps: size - 1, start: [0, sc] });

// expand leftwards
const edgeL = countPlots({ maxSteps: size - 1, start: [sr, size - 1] });

const smallSteps = (size >> 1) - 1;
const smallTR = countPlots({ maxSteps: smallSteps, start: [size - 1, 0] });
const smallBR = countPlots({ maxSteps: smallSteps, start: [0, 0] });
const smallBL = countPlots({ maxSteps: smallSteps, start: [0, size - 1] });
const smallTL = countPlots({
  maxSteps: smallSteps,
  start: [size - 1, size - 1],
});

const largeSteps = ((size * 3) >> 1) - 1;
const largeTR = countPlots({ maxSteps: largeSteps, start: [size - 1, 0] });
const largeBR = countPlots({ maxSteps: largeSteps, start: [0, 0] });
const largeBL = countPlots({ maxSteps: largeSteps, start: [0, size - 1] });
const largeTL = countPlots({
  maxSteps: largeSteps,
  start: [size - 1, size - 1],
});

const res =
  odd * oddPoints +
  even * evenPoints +
  (edgeT + edgeR + edgeB + edgeL) +
  (gw + 1) * (smallTR + smallBR + smallBL + smallTL) +
  gw * (largeTR + largeBR + largeBL + largeTL);
console.log("Part 2:", { res });
