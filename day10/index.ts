import { printGrid, readInput } from "../helpers";

const dir = import.meta.dir;
const lines = readInput(dir);

type Corner = "F" | "7" | "L" | "J";

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
const checkCorner = (v: string) => {
  if (isCorner(v)) {
    lastCorner = v as Corner;
  }
};

const startPos = getIndex(sR, sC);
const paths = getDirs(sR, sC);
const endPos = getIndex(paths[1][0], paths[1][1]);

if (paths.length !== 2) throw new Error("Invalid start");
const p = {
  r: paths[0][0],
  c: paths[0][1],
  dist: 2,
  visited: new Set<number>([startPos, getIndex(paths[0][0], paths[0][1])]),
};

// determine what type of corner starting point is
let lastCorner = grid[sR][sC] as "F" | "7" | "L" | "J";
if (grid[sR][sC] === "S") {
  let up = grid[sR - 1]?.[sC];
  let down = grid[sR + 1]?.[sC];
  let left = grid[sR]?.[sC - 1];
  let right = grid[sR]?.[sC + 1];

  if (
    (right === "-" || right === "J" || right === "7") &&
    (down === "|" || down === "L" || down === "J")
  ) {
    lastCorner = "F";
  } else if (
    (left === "-" || left === "F" || left === "L") &&
    (down === "|" || down === "L" || down === "J")
  ) {
    lastCorner = "7";
  } else if (
    (right === "-" || right === "J" || right === "7") &&
    (up === "|" || up === "7" || up === "F")
  ) {
    lastCorner = "L";
  } else if (
    (left === "-" || left === "F" || left === "L") &&
    (up === "|" || up === "7" || up === "F")
  ) {
    lastCorner = "J";
  }
}

const enclosed = new Set<number>();
const cornerSet = new Set(["F", "7", "L", "J"]);

const isCorner = (s: string): s is Corner => cornerSet.has(s);

// we start at 1 step
checkCorner(grid[p.r][p.c]);
let offset = [0, 0];
switch (lastCorner) {
  case "F":
    offset = p.c === sC ? [0, 1] : [1, 0];
    break;
  case "7":
    offset = p.c === sC ? [0, -1] : [1, 0];
    break;
  case "L":
    offset = p.c === sC ? [0, 1] : [-1, 0];
    break;
  case "J":
    offset = p.c === sC ? [0, -1] : [-1, 0];
    break;
}

const checkArea = (r: number, c: number) => {
  const v = grid[r][c];
  if (v === ".") {
    grid[r][c] = "X";
    enclosed.add(getIndex(r, c));
    checkArea(r + 1, c);
    checkArea(r - 1, c);
    checkArea(r, c + 1);
    checkArea(r, c - 1);
  }
};

const countArea = (r: number, c: number) => {
  const v = grid[r][c];

  // check edges
  switch (v) {
    case "F":
      if (offset[0] < 0 || offset[1] < 0) {
        checkArea(r - 1, c); // check up
        checkArea(r, c - 1); // check left
      }
      break;
    case "L":
      if (offset[0] > 0 || offset[1] < 0) {
        checkArea(r + 1, c); // check down
        checkArea(r, c - 1); // check left
      }
      break;
    case "J":
      if (offset[0] > 0 || offset[1] > 0) {
        checkArea(r + 1, c); // check down
        checkArea(r, c + 1); // check right
      }
      break;
    case "7":
      if (offset[0] < 0 || offset[1] > 0) {
        checkArea(r - 1, c); // check up
        checkArea(r, c + 1); // check right
      }
      break;
  }
};

countArea(p.r, p.c);

let dist: number = 0;
while (1) {
  if (getIndex(p.r, p.c) === endPos) {
    dist = p.dist; // dist should be the same for both
    break;
  }

  const cv = grid[p.r][p.c];
  if (isCorner(cv)) {
    switch (cv) {
      case "F":
        offset = [offset[1], offset[0]];
        break;
      case "L":
        offset = [-offset[1], -offset[0]];
        break;
      case "J":
        offset = [offset[1], offset[0]];
        break;
      case "7":
        offset = [-offset[1], -offset[0]];
        break;
    }
  }

  const dirs = getDirs(p.r, p.c);

  dirs.forEach((d, i) => {
    const v = grid[d[0]]?.[d[1]];
    const pos = getIndex(d[0], d[1]);

    if (v && v !== "." && !p.visited.has(pos)) {
      p.visited.add(pos);
      p.r = d[0];
      p.c = d[1];
      p.dist++;

      checkCorner(v);

      if (v === "|" || v === "-") {
        let cr = p.r + offset[0];
        let cc = p.c + offset[1];
        checkArea(cr, cc);
      }

      countArea(p.r, p.c);
    }
  });
}
console.log("Part 1: ", dist / 2);

// part 2
// 25, 27, 50, 51 wrong
console.log(printGrid(grid));
console.log("Part 2: ", enclosed.size);
