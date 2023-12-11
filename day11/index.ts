import { readInput } from "../helpers";

type GMap = Record<string, [number, number]>;
const gMap: GMap = {};
const dir = import.meta.dir;
const lines = readInput(dir);

// part 1
let i = 1;
let emptyRows: number[] = [];
let emptyCols: number[] = [];

lines.forEach((line, rI) => {
  const matches = [...line.matchAll(/#/g)];
  if (!matches.length) emptyRows.push(rI); // no galaxies in this row
  if (matches) matches.forEach((g) => (gMap[`${i++}`] = [rI, g.index!]));
});

// find empty columns
// distance must ge greater than 1 to be empty
let tmp = Object.values(gMap).sort((a, b) => a[1] - b[1]);
for (let i = 0; i < tmp.length - 1; i++) {
  let [, c] = tmp[i];
  let [, c2] = tmp[i + 1];
  if (c2 - c > 1) for (let j = c + 1; j < c2; j++) emptyCols.push(j);
}

// find pairs of distances
const getDistances = (scale = 1) => {
  const newMap = structuredClone(gMap);

  // adjust indices
  const offsets = Object.keys(newMap).reduce<GMap>(
    (acc, g) => (acc[g] = [0, 0]) && acc,
    {}
  );

  const gKeys = Object.keys(newMap);
  emptyCols.forEach((col) => {
    gKeys.forEach((g) => {
      const [r, c] = newMap[g];
      if (c > col) offsets[g][1] += scale - 1; // expand right
    });
  });
  emptyRows.forEach((row) => {
    gKeys.forEach((g) => {
      const [r, c] = newMap[g];
      if (r > row) offsets[g][0] += scale - 1; // expand down
    });
  });

  // adjust for expansion
  Object.keys(newMap).forEach((g) => {
    const [r, c] = newMap[g];
    newMap[g] = [r + offsets[g][0], c + offsets[g][1]];
  });

  const distances: number[] = [];
  const pairSet = new Set<string>();
  Object.keys(newMap).forEach((g) => {
    Object.keys(newMap).forEach((g2) => {
      if (g === g2) return;
      let key = g < g2 ? `${g},${g2}` : `${g2},${g}`;

      if (!pairSet.has(key)) {
        const [r, c] = newMap[g];
        const [r2, c2] = newMap[g2];

        distances.push(Math.abs(r - r2) + Math.abs(c - c2));
        pairSet.add(key);
      }
    });
  });
  return distances.sum();
};

console.log("Part 1: ", getDistances(2));
console.log("Part 2: ", getDistances(1000000));
