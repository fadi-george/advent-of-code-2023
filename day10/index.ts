import { floodFill, getSurrounding, printGrid, readInput } from "../helpers";

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
const borderSet1 = new Set<number>();
const borderSet2 = new Set<number>();
const debugArr1: [number, number][] = [];
const debugArr2: [number, number][] = [];

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
borderSet1.add(getIndex(sR, sC));
debugArr1.push([sR, sC]);
borderSet1.add(getIndex(paths[0][0], paths[0][1]));
debugArr1.push([paths[0][0], paths[0][1]]);

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
      borderSet1.add(pos);
      debugArr1.push([d[0], d[1]]);
    }
  });
}
console.log("Part 1: ", dist / 2);

// part 2
const enclosed = new Set<number>();

const scaleP = (v: number) => 3 * v + 1;
const getIndex2 = (r: number, c: number) => 3 * r * grid[0].length + c;

const newGrid: string[][] = new Array(grid.length * 3)
  .fill(null)
  .map(() => new Array(grid[0].length * 3).fill(null));

// scale up original grid by 3
for (let i = 0; i < grid.length; i++) {
  for (let j = 0; j < grid[0].length; j++) {
    let ch = "";
    switch (grid[i][j]) {
      case ".":
        ch = "....I....";
        break;

      case "-":
        ch = "...---...";
        break;

      case "|":
        ch = ".|..|..|.";
        break;

      case "7":
        ch = "...-7..|.";
        break;

      case "L":
        ch = ".|..L-...";
        break;

      case "J":
        ch = ".|.-J....";
        break;

      case "F":
        ch = "....F-.|.";
        break;

      case "S":
        let top = grid[i - 1]?.[j];
        let bottom = grid[i + 1]?.[j];
        let left = grid[i]?.[j - 1];
        let right = grid[i]?.[j + 1];
        let t = ".";
        let b = ".";
        let l = ".";
        let r = ".";

        if (top === "|" || top === "7" || top === "F") t = "|";
        if (bottom === "|" || bottom === "L" || bottom === "J") b = "|";
        if (left === "-" || left === "F" || left === "L") l = "-";
        if (right === "-" || right === "J" || right === "7") r = "-";

        ch = `.${t}.${l}S${r}.${b}.`;
        break;
    }

    for (let k = 0; k < ch.length; k++) {
      newGrid[i * 3 + Math.floor(k / 3)][j * 3 + (k % 3)] = ch[k];

      if (borderSet1.has(getIndex(i, j))) {
        if (ch[k] !== "." && ch[k] !== "I") {
          borderSet2.add(getIndex2(i * 3 + Math.floor(k / 3), j * 3 + (k % 3)));
          debugArr2.push([i * 3 + Math.floor(k / 3), j * 3 + (k % 3)]);
        }
      }
    }
  }
}

// determine what type of corner starting point is
const fillCh = "/";
const sR2 = scaleP(sR);
const sC2 = scaleP(sC);

const checkArea = (r: number, c: number) => {
  const v = newGrid[r]?.[c];
  const p = getIndex2(r, c);

  if (v !== fillCh) {
    if (v === "I") {
      enclosed.add(p);
    } else if (!borderSet2.has(p)) {
      if (v !== ".") {
        // transform to I
        const rOffset = r % 3;
        const cOffset = c % 3;
        const center = [r + 1 - rOffset, c + 1 - cOffset];
        newGrid[center[0]][center[1]] = "I";
        enclosed.add(getIndex2(center[0], center[1]));

        const s = getSurrounding(center[0], center[1]);
        s.forEach((s) => {
          if (!borderSet2.has(getIndex2(s[0], s[1]))) {
            newGrid[s[0]][s[1]] = fillCh;
          }
        });
      } else {
        newGrid[r][c] = fillCh;
      }
      checkArea(r + 1, c);
      checkArea(r - 1, c);
      checkArea(r, c + 1);
      checkArea(r, c - 1);
    }
  }
};

printGrid(newGrid);

// disregard outside area
floodFill(newGrid, 0, 0, [".", "I"], fillCh);

// check starting area
getSurrounding(sR2, sC2).forEach((s) => {
  if (newGrid[s[0]]?.[s[1]] !== fillCh) {
    checkArea(s[0], s[1]);
    return;
  }
});

printGrid(newGrid);

// 25, 27, 50, 51 wrong, 382
console.log("Part 2: ", enclosed.size);
