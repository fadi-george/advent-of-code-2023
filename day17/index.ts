import { MinHeap } from "../MinHeap";
import { AStar, type Position, readInput, printGrid } from "../helpers";

const dir = import.meta.dir;
const lines = readInput(dir, "\n");

const heatGrid: number[][] = [];
lines.forEach((line, rI) => {
  heatGrid.push(line.split("").map(Number));
});

enum Dir {
  Up,
  Down,
  Right,
  Left,
}

type PQ = {
  hl: number; // heat loss
  r: number; // row
  c: number; // col
  lastDir: Dir; // last direction traveled
  dir: Dir; // direction traveling
  dirCount: number; // number of times direction has been traveled
  value: number;
};

const end = { r: heatGrid.length - 1, c: heatGrid[0].length - 1 };
const heap = new MinHeap<PQ>();
const seen = new Set<string>();

printGrid(heatGrid);
console.log("end", end);

heap.add({
  hl: heatGrid[0][0],
  r: 0,
  c: 0,
  lastDir: Dir.Down,
  dir: Dir.Right,
  dirCount: 0,
  value: heatGrid[0][0],
  paths: [[0, 0]],
});
heap.add({
  hl: heatGrid[0][0],
  r: 0,
  c: 0,
  lastDir: Dir.Down,
  dir: Dir.Down,
  dirCount: 0,
  value: heatGrid[0][0],
  paths: [[0, 0]],
});

while (heap.length > 0) {
  const { hl, r, c, lastDir, dir, dirCount, value, paths } = heap.remove()!;
  // console.log({
  //   hl,
  //   r,
  //   c,
  //   lastDir,
  //   dir,
  //   dirCount,
  //   value,
  // });

  if (r === end.r && c === end.c) {
    console.log("Part 1: ", { hl, r, c, lastDir, dir, dirCount, value, paths });
    console.log(
      "what",
      paths.reduce((acc, [r, c]) => acc + heatGrid[r][c], 0)
    );
    paths.forEach(([r, c]) => {
      heatGrid[r][c] = "#";
    });
    printGrid(heatGrid);
    break;
  }

  const key = `${r}-${c}-${dir}-${dirCount}`;

  if (seen.has(key)) continue;
  seen.add(key);

  if (lastDir === dir && dirCount < 3) {
    const nr = r + (dir === Dir.Up ? -1 : dir === Dir.Down ? 1 : 0);
    const nc = c + (dir === Dir.Left ? -1 : dir === Dir.Right ? 1 : 0);
    const v2 = heatGrid[nr]?.[nc];
    if (v2 !== undefined)
      heap.add({
        hl: hl + value,
        r: nr,
        c: nc,
        lastDir: dir,
        dir,
        dirCount: dirCount + 1,
        value: v2,
        paths: [...paths, [nr, nc]],
      });
  } else {
    [
      [r - 1, c, Dir.Up],
      [r + 1, c, Dir.Down],
      [r, c - 1, Dir.Left],
      [r, c + 1, Dir.Right],
    ].forEach(([nr, nc, newDir]) => {
      const v2 = heatGrid[nr]?.[c];
      if (v2 !== undefined && lastDir !== newDir) {
        heap.add({
          hl: value + v2,
          r: nr,
          c: nc,
          lastDir: dir,
          dir: newDir,
          dirCount: 1, // reset dir
          value: v2,
          paths: [...paths, [nr, nc]],
        });
      }
    });
  }
}
