import { readInput } from "../helpers";

const dir = import.meta.dir;
const steps = readInput(dir, ",");

// part 1
const getHashes = (steps: string[], stopCh: string[] = []) => {
  const hashes = steps.map((str) => {
    let v = 0;
    for (let c of str) {
      if (stopCh.includes(c)) break;
      v += c.charCodeAt(0);
      v = (v * 17) % 256;
    }
    return v;
  });
  return hashes;
};

const hashes1 = getHashes(steps);
console.log("Part 1: ", hashes1.sum());

// part 2
const hashes2 = getHashes(steps, ["-", "="]);
const boxes: [string, string][][] = new Array(256).fill(null);

steps.forEach((s, i) => {
  const match = s.match(/(.*)(\=|\-)(.*)/);
  const hI = hashes2[i];

  if (!match) return;
  const [, label, op, v] = match;

  // store box
  if (op === "=") {
    boxes[hI] ??= [];
    const bI = boxes[hI].findIndex((b) => b[0] === label);

    if (bI !== -1) boxes[hI][bI][1] = v; // update lens value
    else boxes[hI].push([label, v]); // otherwise add new lens

    // remove lens by label
  } else if (op === "-") {
    if (boxes[hI]) boxes[hI] = boxes[hI].filter((b) => b[0] !== label);
  }
});

const p2 = boxes.reduce(
  (acc, b, bI) =>
    acc + (b || []).reduce((a, s, sI) => a + (bI + 1) * (sI + 1) * +s[1], 0),
  0
);

console.log("Part 2: ", p2);
