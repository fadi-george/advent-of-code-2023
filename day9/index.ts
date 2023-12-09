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

  // console.log(triArr);
  return triArr.reduce((acc, arr) => acc + arr[arr.length - 1], 0);
});
console.log("Part 1: ", nextNums.sum());
