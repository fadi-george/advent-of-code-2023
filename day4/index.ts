import { readInput } from "../helpers";

const dir = import.meta.dir;
const lines = readInput(dir);

let p1 = 0;
lines.forEach((line) => {
  let [_, a, b] = line.split(/\||\:/).map((x) => x.match(/(\d+)/g));
  if (a && b) {
    const winSet = new Set(a.map(Number));
    const score = b.reduce((acc, x) => {
      if (winSet.has(+x)) {
        if (acc === 0) acc = 1;
        else acc *= 2;
      }
      return acc;
    }, 0);
    p1 += score;
  }
});
console.log(p1);
