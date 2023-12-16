import { indexToPos, readInput } from "../helpers";

const dir = import.meta.dir;
const lines = readInput(dir, "\n");

const grid: string[][] = [];
lines.forEach((line) => grid.push(line.split("")));

const width = grid[0].length;
const height = grid.length;

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

// part 1
const getEnergized = (q: QueueItem[], debug = false) => {
  let visited = new Set<string>();
  let energizedSet = new Set<number>();

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
              q.push({ c: c + 1, r, dir });
              break;
            case Dir.Left:
              q.push({ c: c - 1, r, dir });
              break;
            case Dir.Up:
              q.push({ c, r: r - 1, dir });
              break;
            case Dir.Down:
              q.push({ c, r: r + 1, dir });
              break;
          }
          break;

        case "|":
          switch (dir) {
            // split into up and down
            case Dir.Right:
            case Dir.Left:
              q.push({ c, r: r - 1, dir: Dir.Up });
              q.push({ c, r: r + 1, dir: Dir.Down });
              continue;
            case Dir.Up:
            case Dir.Down:
              q.push({ c, r: dir === Dir.Up ? r - 1 : r + 1, dir });
              break;
          }
          break;

        case "-":
          switch (dir) {
            // split into left and right
            case Dir.Up:
            case Dir.Down:
              q.push({ c: c - 1, r, dir: Dir.Left });
              q.push({ c: c + 1, r, dir: Dir.Right });
              continue;
            case Dir.Left:
            case Dir.Right:
              q.push({ c: dir === Dir.Left ? c - 1 : c + 1, r, dir });
              break;
          }
          break;

        // reflect 90 degrees
        case "/":
          switch (dir) {
            case Dir.Up:
              // take a right
              q.push({ c: c + 1, r, dir: Dir.Right });
              break;
            case Dir.Down:
              // take a left
              q.push({ c: c - 1, r, dir: Dir.Left });
              break;
            case Dir.Left:
              // go down
              q.push({ c, r: r + 1, dir: Dir.Down });
              break;
            case Dir.Right:
              // go up
              q.push({ c, r: r - 1, dir: Dir.Up });
              break;
          }
          break;

        // reflect 90 degrees
        case "\\":
          switch (dir) {
            case Dir.Up:
              // take a left
              q.push({ c: c - 1, r, dir: Dir.Left });
              break;
            case Dir.Down:
              // take a right
              q.push({ c: c + 1, r, dir: Dir.Right });
              break;
            case Dir.Left:
              // go up
              q.push({ c, r: r - 1, dir: Dir.Up });
              break;
            case Dir.Right:
              // go down
              q.push({ c, r: r + 1, dir: Dir.Down });
              break;
          }
          break;
      }
    }
  }
  return energizedSet.size;
};

console.log("Part 1: ", getEnergized([{ r: 0, c: 0, dir: Dir.Right }]));

// part 2
const perimeterInds = [
  grid[0].map((_, i) => [0, i]), // top row
  grid[grid.length - 1].map((_, i) => [grid.length - 1, i]), // bottom row
  grid.slice(1, grid.length - 1).map((_, rI) => [rI + 1, grid.length - 1]), // right col
  grid.slice(1, grid.length - 1).map((_, rI) => [rI + 1, 0]), // left col
];

const p2 = perimeterInds.flat().map(([r, c]) => {
  const q: QueueItem[] = [];

  // top row & corners
  if (r === 0) {
    q.push({ r, c, dir: Dir.Down });
    if (c === 0) q.push({ r, c, dir: Dir.Right });
    else if (c === width - 1) q.push({ r, c, dir: Dir.Left });

    // bottom row & corners
  } else if (r === height - 1) {
    q.push({ r, c, dir: Dir.Up });
    if (c === 0) q.push({ r, c, dir: Dir.Right });
    else if (c === width - 1) q.push({ r, c, dir: Dir.Left });

    // left col
  } else if (c === 0) {
    q.push({ r, c, dir: Dir.Right });

    // right col
  } else if (c === width - 1) q.push({ r, c, dir: Dir.Left });

  return getEnergized(q);
});
console.log("Part 2: ", Math.max(...p2));
