import { indexToPos, readInput } from "../helpers";

const dir = import.meta.dir;
const lines = readInput(dir);

// part 1
let sR = 0;
let sC = 0;
let g: string[][] = [];
lines.forEach((line, rI) => {
  line.split("").forEach((v, cI) => {
    g[rI] ??= [];
    g[rI][cI] = v;
    if (v === "S") {
      sR = rI;
      sC = cI;
    }
  });
});

// replace s corner with 'F', 'L', 'J' or  '7'
let up = g[sR - 1]?.[sC];
let down = g[sR + 1]?.[sC];
let left = g[sR]?.[sC - 1];
let right = g[sR]?.[sC + 1];

let corner = "";
if (
  (right === "-" || right === "J" || right === "7") &&
  (down === "|" || down === "L" || down === "J")
) {
  corner = "F";
} else if (
  (left === "-" || left === "F" || left === "L") &&
  (down === "|" || down === "L" || down === "J")
) {
  corner = "7";
} else if (
  (right === "-" || right === "J" || right === "7") &&
  (up === "|" || up === "7" || up === "F")
) {
  corner = "L";
} else if (
  (left === "-" || left === "F" || left === "L") &&
  (up === "|" || up === "7" || up === "F")
) {
  corner = "J";
}
g[sR][sC] = corner;

const getDirs = (arr: string[][], r: number, c: number) => {
  let dirs: number[][] = [];
  switch (arr[r][c]) {
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

const startPos = indexToPos(g, sR, sC);
const paths = getDirs(g, sR, sC);
const endPos = indexToPos(g, paths[1][0], paths[1][1]);

if (paths.length !== 2) throw new Error("Invalid start");
const p = {
  r: paths[0][0],
  c: paths[0][1],
  dist: 2,
  visited: new Set<number>([startPos, indexToPos(g, paths[0][0], paths[0][1])]),
};

let dist: number = 0;
while (1) {
  if (indexToPos(g, p.r, p.c) === endPos) {
    dist = p.dist; // dist should be the same for both
    break;
  }
  const dirs = getDirs(g, p.r, p.c);

  dirs.forEach((d) => {
    const v = g[d[0]]?.[d[1]];
    const pos = indexToPos(g, d[0], d[1]);

    if (v && v !== "." && !p.visited.has(pos)) {
      p.visited.add(pos);
      p.r = d[0];
      p.c = d[1];
      p.dist++;
    }
  });
}
console.log("Part 1: ", dist / 2);

// part 2
// clean g i.e. pipes not from main loop
for (let i = 0; i < g.length; i++)
  for (let j = 0; j < g[0].length; j++)
    if (g[i][j] !== ".") if (!p.visited.has(indexToPos(g, i, j))) g[i][j] = ".";

// count enclosed areas by keep track of inside/outside
let inside = false;
let count = 0;
const flipSet = new Set(["|", "J", "L"]);
for (let i = 0; i < g.length; i++) {
  for (let j = 0; j < g[0].length; j++) {
    if (flipSet.has(g[i][j])) {
      inside = !inside;
      continue;
    }
    if (g[i][j] === ".") {
      if (inside) {
        g[i][j] = "I";
        count++;
      }
    }
  }
}
console.log("Part 2: ", count);
