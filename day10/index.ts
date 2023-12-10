import { readInput } from "../helpers";

const dir = import.meta.dir;
const lines = readInput(dir);

// part 1
let sR = 0;
let sC = 0;
let grid: string[][] = [];
lines.forEach((line, rI) => {
  line.split("").forEach((v, cI) => {
    grid[rI] ??= [];
    grid[rI][cI] = v;

    if (v === "S") {
      sR = rI;
      sC = cI;
    }
  });
});

const startPos = sR * grid[0].length + sC;

const p1 = {
  r: sR,
  c: sC,
  dist: 0,
  visited: new Set<number>([startPos]),
};
const p2 = {
  r: sR,
  c: sC,
  dist: 0,
  visited: new Set<number>([startPos]),
};

const getDirs = (r: number, c: number) => {
  let dirs: number[][] = [];
  switch (grid[r][c]) {
    case "S":
      dirs = [];
      let up = grid[r - 1]?.[c];
      let down = grid[r + 1]?.[c];
      let left = grid[r]?.[c - 1];
      let right = grid[r]?.[c + 1];

      if (up === "|" || up === "7" || up === "F") dirs.push([r - 1, c]);
      if (down === "|" || down === "L" || down === "J") dirs.push([r + 1, c]);
      if (left === "-" || left === "F" || left === "L") dirs.push([r, c - 1]);
      if (right === "-" || right === "J" || right === "7")
        dirs.push([r, c + 1]);
      break;
    case "-":
      dirs = [
        [r, c - 1], // left
        [r, c + 1], // right
      ];
      break;
    case "|":
      dirs = [
        [r - 1, c], // up
        [r + 1, c], // down
      ];
      break;
    case "7":
      dirs = [
        [r, c - 1], // left
        [r + 1, c], // down
      ];
      break;
    case "L":
      dirs = [
        [r - 1, c], // up
        [r, c + 1], // right
      ];
      break;
    case "J":
      dirs = [
        [r - 1, c], // up
        [r, c - 1], // left
      ];
      break;
    case "F":
      dirs = [
        [r, c + 1], // right
        [r + 1, c], // down
      ];
      break;
  }
  return dirs;
};
const getIndex = (r: number, c: number) => r * grid[0].length + c;

const paths = getDirs(sR, sC).filter((d) => {
  const v = grid[d[0]]?.[d[1]];
  return v !== "." && v !== undefined;
});
if (paths.length !== 2) throw new Error("Invalid start");

paths.forEach((p, i) => {
  let tmp = i === 0 ? p1 : p2;
  tmp.r = p[0];
  tmp.c = p[1];
  tmp.visited.add(getIndex(p[0], p[1]));
  tmp.dist++;
});

let dist;
while (1) {
  if (p1.r === p2.r && p1.c === p2.c) {
    dist = p1.dist; // dist should be the same for both
    break;
  }

  [p1, p2].forEach((p) => {
    const dirs = getDirs(p.r, p.c);
    dirs.forEach((d, i) => {
      const v = grid[d[0]]?.[d[1]];
      const pos = getIndex(d[0], d[1]);

      if (v !== "." && !p.visited.has(pos)) {
        p.visited.add(pos);
        p.r = d[0];
        p.c = d[1];
        p.dist++;
      }
    });
  });
}

console.log("Part 1: ", dist);
