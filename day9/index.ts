import { lcm, readInput } from "../helpers";

const dir = import.meta.dir;
const lines = readInput(dir);

// part 1
const nextNums = lines.map((line) => {
  const vals = line.match(/(-?\d)+/g)!.map(Number);

  let triArr = [vals];
  let i = 0;

  while (!triArr[i].every((n) => n === 0)) {
    let nextArr = [];
    for (let j = 1; j < triArr[i].length; j++) {
      nextArr.push(triArr[i][j] - triArr[i][j - 1]);
    }

    triArr.push(nextArr);
    i++;
  }
  return triArr;
});
const p1 = nextNums.reduce(
  (acc, arrs) => acc + arrs.reduce((acc, arr) => acc + arr[arr.length - 1], 0),
  0
);
console.log("Part 1: ", p1);

// part 2
const p2 = nextNums.reduce((acc, arrs) => {
  let prev = 0;
  for (let i = arrs.length - 2; i >= 0; i--) {
    prev = arrs[i][0] - prev;
  }

  return acc + prev;
}, 0);
console.log("Part 2: ", p2);
