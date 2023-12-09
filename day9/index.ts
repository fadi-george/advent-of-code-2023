import { readInput } from "../helpers";

const dir = import.meta.dir;
const lines = readInput(dir);

// part 1
const tris = lines.map((line) => {
  const vals = line.match(/(-?\d)+/g)!.map(Number);

  let tri = [vals];
  let i = 0;

  while (tri[i].some((n) => n !== 0)) {
    let next = [];
    for (let j = 1; j < tri[i].length; j++)
      next.push(tri[i][j] - tri[i][j - 1]);

    tri.push(next);
    i++;
  }
  return tri;
});
const p1 = tris.reduce(
  (acc, arrs) => acc + arrs.reduce((acc, arr) => acc + arr[arr.length - 1], 0),
  0
);
console.log("Part 1: ", p1);

// part 2
const p2 = tris.reduce(
  (acc, arrs) =>
    acc + arrs.slice(0, arrs.length - 1).reduceRight((a, r) => r[0] - a, 0),
  0
);
console.log("Part 2: ", p2);
