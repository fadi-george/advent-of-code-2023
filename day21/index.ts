import { indexToPos, padGrid, printGrid, readInput } from "../helpers";

const grid1: string[][] = [];
const sPos = [-1, -1];

const lines = readInput(import.meta.dir);
lines.forEach((line, rI) => {
  grid1.push(line.split(""));
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
let dirCounts = [0, 0, 0, 0]; // [up, right, down, left]

const grid2 = structuredClone(grid1);
grid2[sPos[0]][sPos[1]] = ".";

const countPlots = (
  grid: string[][],
  maxSteps: number,
  start: number[],
  isInf: boolean = false
) => {
  const visited = new Set<number>();
  const plots = new Set<number>();
  let acc = 0;

  // let count = 0;
  const queue = [
    {
      pos: start,
      count: 0,
    },
  ];

  while (queue.length) {
    const {
      pos: [r, c],
      count,
    } = queue.shift()!;

    if (count > maxSteps) {
      break;
    }

    const key = indexToPos(grid, r, c);

    if (r === 0) {
      // up
      dirCounts[0] = count;
    } else if (r === grid.length - 1) {
      // down
      dirCounts[2] = count;
    } else if (c === 0) {
      // left
      dirCounts[3] = count;
    } else if (c === grid[0].length - 1) {
      // right
      dirCounts[1] = count;
    }

    if ((count & 1) === 0) {
      if (!plots.has(key)) {
        plots.add(key);
      }
    }
    if (visited.has(key)) continue;
    visited.add(key);

    dirs.forEach(([dr, dc]) => {
      const [nr, nc] = [r + dr, c + dc];
      const v = grid[nr]?.[nc];
      if (v === ".") {
        queue.push({ pos: [nr, nc], count: count + 1 });
      } else if (isInf && !v) {
        console.log("inf", nr, nc);
        // acc += countPlots(grid2, count, isFinite);
      }
    });
  }
  return acc + plots.size;
};

const p1 = countPlots(grid1, 64, sPos);
console.log("Part 1: ", p1);

// part 2

// const len = grid2.length;
// dirCounts = [0, 0, 0, 0];
countPlots(grid2, 6, sPos);
