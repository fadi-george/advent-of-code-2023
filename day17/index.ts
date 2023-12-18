import { PriorityQueue } from "datastructures-js";
import { readInput } from "../helpers";

const dir = import.meta.dir;
const lines = readInput(dir, "\n");

const grid: number[][] = [];
lines.forEach((line) => grid.push(line.split("").map((v) => +v)));

const goal = { r: grid.length - 1, c: grid[0].length - 1 };

type QueueItem = {
  r: number;
  c: number;
  dr: number;
  dc: number;
  hl: number;
  dCount: number;
};

const getPath = (minCount: number, maxCount: number) => {
  const q = new PriorityQueue<QueueItem>((p1, p2) => p1.hl - p2.hl);
  q.push({
    r: 1,
    c: 0,
    dr: 1,
    dc: 0,
    hl: grid[1][0],
    dCount: 1,
  });
  q.push({
    r: 0,
    c: 1,
    dr: 0,
    dc: 1,
    hl: grid[0][1],
    dCount: 1,
  });

  const seen = new Set<string>();
  const dirs = [
    [-1, 0], // up
    [1, 0], // down
    [0, -1], // left
    [0, 1], // right
  ];

  while (q.size() > 0) {
    const { hl, r, c, dr, dc, dCount } = q.pop();

    // stop at bottom right
    if (r === goal.r && c === goal.c && dCount >= minCount) return hl;

    const key = `${r}-${c}-${dr}-${dc}-${dCount}`;
    if (seen.has(key)) continue;
    seen.add(key);

    // keep going in some direction
    if (dCount < maxCount) {
      const nr = r + dr;
      const nc = c + dc;
      const v = grid[nr]?.[nc];
      if (v !== undefined)
        q.push({ r: nr, c: nc, dr, dc, hl: hl + v, dCount: dCount + 1 });
    }

    // can only take turns after some minimum distance at which point
    // the direction count is reset
    if (dCount >= minCount)
      for (const [dr2, dc2] of dirs) {
        if (dr2 === -dr && dc2 === -dc) continue;
        if (dr2 === dr && dc2 === dc) continue;

        let nr = r + dr2;
        let nc = c + dc2;
        const v = grid[nr]?.[nc];

        if (v !== undefined)
          q.push({ r: nr, c: nc, dr: dr2, dc: dc2, hl: hl + v, dCount: 1 });
      }
  }
};

console.log("Part 1: ", getPath(0, 3));
console.log("Part 2: ", getPath(4, 10));
