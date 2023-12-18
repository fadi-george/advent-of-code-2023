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

const getPath = (minCount: number, maxCount: number) => {
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

  while (q.size() > 0) {
    const { hl, r, c, dr, dc, dirCount } = q.pop();

    // stop at bottom right
    if (r === goal.r && c === goal.c) return hl;

    if (seen.has(`${r}-${c}-${dr}-${dc}-${dirCount}`)) continue;
    seen.add(`${r}-${c}-${dr}-${dc}-${dirCount}`);

    for (const [dr2, dc2] of dirs) {
      if (dr2 === -dr && dc2 == -dc) continue;

      let nr = r + dr2;
      let nc = c + dc2;
      const newDirCount = dr === dr2 && dc === dc2 ? dirCount + 1 : 1;
      const v = heatGrid[nr]?.[nc];

      if (v === undefined) continue;

      // prevent going some maximum steps in the same direction
      if (newDirCount > maxCount) continue;
      if (newDirCount < minCount) {
        const diffCount = minCount - newDirCount;
        const nr2 = nr + dr2 * diffCount;
        const nc2 = nc + dc2 * diffCount;
        const v2 = heatGrid[nr2]?.[nc2];

        if (v2 === undefined) continue;
        let hl2 = hl + v;
        for (let i = nr + 1; i <= nr2; i++) {
          hl2 += heatGrid[i][c];
        }
        for (let i = nc + 1; i <= nc2; i++) {
          hl2 += heatGrid[r][i];
        }

        q.enqueue({
          r: nr2,
          c: nc2,
          dr: dr2,
          dc: dc2,
          hl: hl2,
          dirCount: minCount,
        });
      } else {
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
};

console.log("Part 1: ", getPath(0, 3));

// wip - 703 too low
console.log("Part 2: ", getPath(4, 10));
