import {
  floodFill,
  getSurrounding,
  printGrid,
  printSetInds,
  readInput,
} from "../helpers";

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

// helpers
const borderSet = new Set<number>();

const getDirs = (arr: string[][], r: number, c: number) => {
  let dirs: number[][] = [];
  switch (arr[r][c]) {
    case "S":
      dirs = [];
      let up = arr[r - 1]?.[c];
      let down = arr[r + 1]?.[c];
      let left = arr[r]?.[c - 1];
      let right = arr[r]?.[c + 1];

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

const startPos = getIndex(sR, sC);
const paths = getDirs(grid, sR, sC);
const endPos = getIndex(paths[1][0], paths[1][1]);

if (paths.length !== 2) throw new Error("Invalid start");
const p = {
  r: paths[0][0],
  c: paths[0][1],
  dist: 2,
  visited: new Set<number>([startPos, getIndex(paths[0][0], paths[0][1])]),
};
borderSet.add(getIndex(sR, sC));
borderSet.add(getIndex(paths[0][0], paths[0][1]));

let dist: number = 0;
while (1) {
  if (getIndex(p.r, p.c) === endPos) {
    dist = p.dist; // dist should be the same for both
    break;
  }
  const dirs = getDirs(grid, p.r, p.c);

  dirs.forEach((d, i) => {
    const v = grid[d[0]]?.[d[1]];
    const pos = getIndex(d[0], d[1]);

    if (v && v !== "." && !p.visited.has(pos)) {
      p.visited.add(pos);
      p.r = d[0];
      p.c = d[1];
      p.dist++;
      borderSet.add(pos);
    }
  });
}
console.log("Part 1: ", dist / 2);

// part 2
const fillCh = "/";
const enclosed = new Set<number>();

const checkArea = (r: number, c: number) => {
  const v = grid[r]?.[c];
  const p = getIndex(r, c);
  console.log("Checking", r, c, v);

  if (v && v !== fillCh) {
    if (v === "I") {
      enclosed.add(p);
    } else if (!borderSet.has(p)) {
      enclosed.add(p);
      grid[r][c] = "I";

      checkArea(r + 1, c);
      checkArea(r - 1, c);
      checkArea(r, c + 1);
      checkArea(r, c - 1);
    }
  }
};

printSetInds(grid, borderSet);
printGrid(grid);

// disregard outside area
floodFill(grid, 0, 0, [".", "I"], fillCh);

// check starting area
getSurrounding(sR, sC).forEach((s) => {
  if (grid[s[0]]?.[s[1]] !== fillCh) {
    checkArea(s[0], s[1]);
    return;
  }
});

printGrid(grid);

// 25, 27, 50, 51 wrong, 382
console.log("Part 2: ", enclosed.size);
