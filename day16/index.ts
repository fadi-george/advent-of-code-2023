import { indexToPos, posToIndices, printGrid, readInput } from "../helpers";

const dir = import.meta.dir;
const lines = readInput(dir, "\n");

const grid: string[][] = [];
lines.forEach((line) => {
  grid.push(line.split(""));
});
// printGrid(grid);

// const visited: Set<number> = new Set();

enum Dir {
  Up,
  Down,
  Left,
  Right,
}
type QueueItem = {
  r: number;
  c: number;
  dir: Dir;
};

const q: QueueItem[] = [
  {
    r: 0,
    c: 0,
    dir: Dir.Right,
  },
];

let splitCount = 0;
let energizedSet = new Set<number>();
let visited = new Set<string>();
energizedSet.add(indexToPos(grid, 0, 0));

while (q.length > 0) {
  let { r, c, dir } = q.shift()!;

  const v = grid[r]?.[c];
  if (v) {
    const pos = indexToPos(grid, r, c);
    const key = `${pos}-${dir}`;
    if (visited.has(key)) continue;
    visited.add(key);
    energizedSet.add(pos);

    switch (v) {
      case ".":
        // continue in same direction
        switch (dir) {
          case Dir.Right:
            c += 1;
            break;
          case Dir.Left:
            c -= 1;
            break;
          case Dir.Up:
            r -= 1;
            break;
          case Dir.Down:
            r += 1;
            break;
        }
        q.push({
          r,
          c,
          dir,
        });
        break;

      case "|":
        switch (dir) {
          case Dir.Right:
          case Dir.Left:
            splitCount++;
            // split into up and down
            q.push({
              r: r - 1,
              c,
              dir: Dir.Up,
            });
            q.push({
              r: r + 1,
              c,
              dir: Dir.Down,
            });
            break;
          case Dir.Up:
            // continue up
            q.push({
              r: r - 1,
              c,
              dir: Dir.Up,
            });
            break;
          case Dir.Down:
            // continue down
            q.push({
              r: r + 1,
              c,
              dir: Dir.Down,
            });
            break;
        }
        break;

      case "-":
        // split into left and right
        switch (dir) {
          case Dir.Up:
          case Dir.Down:
            splitCount++;
            q.push({
              r,
              c: c - 1,
              dir: Dir.Left,
            });
            q.push({
              r,
              c: c + 1,
              dir: Dir.Right,
            });
            break;
          case Dir.Left:
            // continue left
            q.push({
              r,
              c: c - 1,
              dir: Dir.Left,
            });
            break;
          case Dir.Right:
            // continue right
            q.push({
              r,
              c: c + 1,
              dir: Dir.Right,
            });
            break;
        }
        break;

      // reflect 90 degrees
      case "/":
        switch (dir) {
          case Dir.Up:
            // take a right
            q.push({
              r,
              c: c + 1,
              dir: Dir.Right,
            });
            break;
          case Dir.Down:
            // take a left
            q.push({
              r,
              c: c - 1,
              dir: Dir.Left,
            });
            break;
          case Dir.Left:
            // go down
            q.push({
              r: r + 1,
              c,
              dir: Dir.Down,
            });
            break;
          case Dir.Right:
            // go up
            q.push({
              r: r - 1,
              c,
              dir: Dir.Up,
            });
            break;
        }
        break;

      // reflect 90 degrees
      case "\\":
        switch (dir) {
          case Dir.Up:
            // take a left
            q.push({
              r,
              c: c - 1,
              dir: Dir.Left,
            });
            break;
          case Dir.Down:
            // take a right
            q.push({
              r,
              c: c + 1,
              dir: Dir.Right,
            });
            break;
          case Dir.Left:
            // go up
            q.push({
              r: r - 1,
              c,
              dir: Dir.Up,
            });
            break;
          case Dir.Right:
            // go down
            q.push({
              r: r + 1,
              c,
              dir: Dir.Down,
            });
            break;
        }
        break;
    }
  }
}

// posToIndices(grid, energizedSet).forEach(([r, c]) => {
//   grid[r][c] = "#";
// });
// printGrid(grid);
// // console.log(posToIndices(grid, visited));
console.log("Part 1: ", energizedSet.size);
