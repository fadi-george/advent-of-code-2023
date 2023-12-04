import { readInput } from "../helpers";

const dir = import.meta.dir;
const lines = readInput(dir);

let p1 = 0;
let p2 = 0;

const cardCounts: Record<number, number> = {};

lines.forEach((line) => {
  let [c, a, b] = line.split(/\||\:/).map((x) => x.match(/(\d+)/g));
  if (a && b && c) {
    const cID = +c[0];
    cardCounts[cID] = cardCounts[cID] || 1;

    const winSet = new Set(a.map(Number));
    const inc = 1 * cardCounts[cID];
    let cardIndex = cID;

    const score = b.reduce((acc, x) => {
      if (winSet.has(+x)) {
        cardIndex++;
        cardCounts[cardIndex] = cardCounts[cardIndex] || 1;
        cardCounts[cardIndex] += inc;

        if (acc === 0) acc = 1;
        else acc *= 2;
      }
      return acc;
    }, 0);
    p1 += score;
  }
});
console.log(p1);

p2 = Object.values(cardCounts).sum();
console.log(p2);
