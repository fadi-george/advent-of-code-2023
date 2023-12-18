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
  dr: number; // delta row
  dc: number; // delta col
  dirCount: number; // number of times direction has been traveled
  value: number;
  paths: [number, number][]; // debug
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
  dr: 0,
  dc: 0,
  dirCount: 0,
  value: heatGrid[0][0],
  paths: [[0, 0]],
});
heap.add({
  hl: heatGrid[0][0],
  r: 0,
  c: 0,
  dr: 0,
  dc: 0,
  dirCount: 0,
  value: heatGrid[0][0],
  paths: [[0, 0]],
});

while (heap.length > 0) {
  const { hl, r, c, dr, dc, dirCount, value, paths } = heap.remove()!;
  // console.log({ hl, r, c, dr, dc, dirCount, value, paths });

  if (r === end.r && c === end.c) {
    console.log("Part 1: ", { hl, paths });
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

  const key = `${r}-${c}-${dr}-${dc}-${dirCount}`;

  if (seen.has(key)) continue;
  seen.add(key);

  if (dirCount < 3 && !(dr === 0 && dc === 0)) {
    const nr = r + dr;
    const nc = c + dc;
    const v2 = heatGrid[nr]?.[nc];
    if (v2 !== undefined) {
      // console.log("1");
      heap.add({
        hl: hl + value,
        r: nr,
        c: nc,
        dr,
        dc,
        dirCount: dirCount + 1,
        paths: [...paths, [nr, nc]],
        value: v2,
      });
    }
  }

  [
    [-1, 0], // top
    [1, 0], // bottom
    [0, 1], // right
    [0, -1], // left
  ].forEach(([dr2, dc2]) => {
    const nr = r + dr2;
    const nc = c + dc2;

    const v2 = heatGrid[nr]?.[nc];
    if (
      v2 !== undefined &&
      !(dr === dr2 && dc === dc2) &&
      !(dr === -dr2 && dc === -dc2)
    ) {
      heap.add({
        hl: value + v2,
        r: nr,
        c: nc,
        dr: dr2,
        dc: dc2,
        dirCount: 1,
        value: v2,
        paths: [...paths, [nr, nc]],
      });
    }
  });
}
