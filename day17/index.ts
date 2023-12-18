import { PriorityQueue } from "datastructures-js";
import { readInput } from "../helpers";

const dir = import.meta.dir;
const lines = readInput(dir, "\n");

const heatGrid: number[][] = [];
lines.forEach((line) => {
  heatGrid.push(line.split("").map((v) => +v));
});

const goal = { r: heatGrid.length - 1, c: heatGrid[0].length - 1 };

type QueueItem = {
  r: number;
  c: number;
  dr: number;
  dc: number;
  hl: number;
  dirCount: number;
};

const q = new PriorityQueue<QueueItem>((p1, p2) => p1.hl - p2.hl);
q.push({
  r: 0,
  c: 0,
  dr: 0,
  dc: 0,
  hl: 0,
  dirCount: 0,
});

const seen = new Set<string>();
const dirs = [
  [-1, 0], // up
  [1, 0], // down
  [0, -1], // left
  [0, 1], // right
];

let p1 = 0;
while (q.size() > 0) {
  const { hl, r, c, dr, dc, dirCount } = q.pop();

  // stop at bottom right
  if (r === goal.r && c === goal.c) {
    p1 = hl;
    break;
  }

  if (seen.has(`${r}-${c}-${dr}-${dc}-${dirCount}`)) continue;
  seen.add(`${r}-${c}-${dr}-${dc}-${dirCount}`);

  let i = 0;
  for (const [dr2, dc2] of dirs) {
    i++;
    if (dr2 === -dr && dc2 == -dc) continue;

    const nr = r + dr2;
    const nc = c + dc2;
    const newDirCount = dr === dr2 && dc === dc2 ? dirCount + 1 : 1;

    if (heatGrid[nr]?.[nc]) {
      const v = heatGrid[nr][nc];

      // prevent going 3 steps in the same direction
      if (newDirCount > 3) continue;

      q.enqueue({
        r: nr,
        c: nc,
        dr: dr2,
        dc: dc2,
        hl: hl + v,
        dirCount: newDirCount,
      });
    }
  }
}
console.log("Part 1: ", p1);
