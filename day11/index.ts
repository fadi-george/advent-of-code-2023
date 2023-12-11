import { readInput } from "../helpers";

const inds: Record<string, [number, number]> = {};
const dir = import.meta.dir;
const lines = readInput(dir);

// part 1
let i = 1;
let emptyRows: number[] = [];
let emptyCols: number[] = [];

lines.forEach((line, rI) => {
  const matches = [...line.matchAll(/#/g)];
  // if (!matches.length) emptyRows.push(rI);
  if (matches) {
    matches.forEach((g) => {
      inds[`${i++}`] = [rI, g.index!];
    });
  }
});

// find empty columns
let tmp = Object.values(inds).sort((a, b) => a[1] - b[1]);
for (let i = 0; i < tmp.length - 1; i++) {
  let [r, c] = tmp[i];
  let [r2, c2] = tmp[i + 1];
  if (c2 - c > 1) {
    for (let j = c + 1; j < c2; j++) {
      emptyCols.push(j);
    }
  }
}

// find empty rows
tmp = Object.values(inds).sort((a, b) => a[0] - b[0]);
for (let i = 0; i < tmp.length - 1; i++) {
  let [r, c] = tmp[i];
  let [r2, c2] = tmp[i + 1];
  if (r2 - r > 1) {
    for (let j = r + 1; j < r2; j++) {
      emptyRows.push(j);
    }
  }
}

// find pairs of distances
const getDistances = (scale = 1) => {
  const newInds = structuredClone(inds);

  // adjust indices
  const offsets = Object.keys(newInds).reduce<Record<string, [number, number]>>(
    (acc, g) => {
      acc[g] = [0, 0];
      return acc;
    },
    {}
  );

  const gKeys = Object.keys(newInds);
  emptyCols.forEach((col) => {
    gKeys.forEach((g) => {
      const [r, c] = newInds[g];
      if (c > col) {
        offsets[g][1] += scale - 1; // expand right
      }
    });
  });
  emptyRows.forEach((row) => {
    gKeys.forEach((g) => {
      const [r, c] = newInds[g];
      if (r > row) {
        offsets[g][0] += scale - 1; // expand down
      }
    });
  });

  // adjust for expansion
  Object.keys(newInds).forEach((g) => {
    const [r, c] = newInds[g];
    newInds[g] = [r + offsets[g][0], c + offsets[g][1]];
  });

  const distances: number[] = [];
  const pairSet = new Set<string>();
  Object.keys(newInds).forEach((g) => {
    Object.keys(newInds).forEach((g2) => {
      if (g === g2) return;
      let key = g < g2 ? `${g},${g2}` : `${g2},${g}`;

      if (!pairSet.has(key)) {
        const [r, c] = newInds[g];
        const [r2, c2] = newInds[g2];

        distances.push(Math.abs(r - r2) + Math.abs(c - c2));
        pairSet.add(key);
      }
    });
  });

  return distances;
};

console.log("Part 1: ", getDistances(2).sum());

// 15208074 wrong
console.log("Part 2: ", getDistances(1000000).sum());
