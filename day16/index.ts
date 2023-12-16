import { indexToPos, posToIndices, printGrid, readInput } from "../helpers";

const dir = import.meta.dir;
const lines = readInput(dir, "\n");

const grid: string[][] = [];
lines.forEach((line) => {
  grid.push(line.split(""));
});

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

const getEnergized = (q: QueueItem[], debug = false) => {
  let energizedSet = new Set<number>();
  let visited = new Set<string>();

  while (q.length > 0) {
    let { r, c, dir } = q.shift()!;

    const v = grid[r]?.[c];

    // if (debug) {
    //   console.log(r, c, v, dir);
    // }

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

    // if (debug) {
    //   console.log(r, c, v, q);
    // }
  }

  // if (debug) {
  //   const g2 = structuredClone(grid);
  //   posToIndices(grid, energizedSet).forEach(([r, c]) => {
  //     g2[r][c] = "#";
  //   });
  //   printGrid(g2);
  // }
  return energizedSet.size;
};

console.log(
  "Part 1: ",
  getEnergized([
    {
      r: 0,
      c: 0,
      dir: Dir.Right,
    },
  ])
);

const perimeterInds = [
  grid[0].map((_, i) => [0, i]), // top row
  grid[grid.length - 1].map((_, i) => [grid.length - 1, i]), // bottom row
  grid.slice(1, grid.length - 1).map((_, rI) => [rI + 1, grid.length - 1]), // right col
  grid.slice(1, grid.length - 1).map((_, rI) => [rI + 1, 0]), // left col
];

const p2 = perimeterInds.flat().map(([r, c]) => {
  const q: QueueItem[] = [];

  // top left corner
  if (r === 0 && c === 0) {
    q.push(
      ...[
        {
          r,
          c,
          dir: Dir.Right,
        },
        {
          r,
          c,
          dir: Dir.Down,
        },
      ]
    );

    // top right corner
  } else if (r === 0 && c === width - 1) {
    q.push(
      ...[
        {
          r,
          c,
          dir: Dir.Left,
        },
        {
          r,
          c,
          dir: Dir.Down,
        },
      ]
    );

    // bottom left corner
  } else if (r === height - 1 && c === 0) {
    q.push(
      ...[
        {
          r,
          c,
          dir: Dir.Right,
        },
        {
          r,
          c,
          dir: Dir.Up,
        },
      ]
    );

    // bottom right corner
  } else if (r === height - 1 && c === width - 1) {
    q.push(
      ...[
        {
          r,
          c,
          dir: Dir.Left,
        },
        {
          r,
          c,
          dir: Dir.Up,
        },
      ]
    );

    // top row
  } else if (r === 0) {
    q.push({
      r,
      c,
      dir: Dir.Down,
    });

    // bottom row
  } else if (r === height - 1) {
    q.push({
      r,
      c,
      dir: Dir.Up,
    });

    // left col
  } else if (c === 0) {
    q.push({
      r,
      c,
      dir: Dir.Right,
    });

    // right col
  } else if (c === width - 1) {
    q.push({
      r,
      c,
      dir: Dir.Left,
    });
  }

  const tmp = getEnergized(q, r === 0 && c === 3);
  // if (r === 0 && c === 3) {
  //   console.log(tmp);
  // }
  return tmp;
});
console.log("Part 2: ", Math.max(...p2));
