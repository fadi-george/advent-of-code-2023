import { indexToPos, readInput } from "../helpers";

const grid: string[][] = [];
const start = [-1, -1];

const lines = readInput(import.meta.dir);
lines.forEach((line, rI) => {
  grid.push(line.split(""));
  if (line.includes("S")) {
    start[0] = rI;
    start[1] = line.indexOf("S");
  }
});

const dirs = [
  [-1, 0], // up
  [0, 1], // right
  [1, 0], // down
  [0, -1], // left
];

const countPlots = (maxSteps: number) => {
  const visited = new Set<number>();
  const plots = new Set<number>();

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

    if ((count & 1) === 0) {
      if (!plots.has(key)) {
        grid[r][c] = "0";
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
      }
    });
  }
  return plots.size;
};

const p1 = countPlots(64);
console.log("Part 1: ", p1);
