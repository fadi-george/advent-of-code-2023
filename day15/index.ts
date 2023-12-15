import { printGrid, readInput, rotateRight } from "../helpers";

const dir = import.meta.dir;
const lines = readInput(dir, ",");

const hashes = lines.map((str) => {
  let v = 0;
  [...str].forEach((c) => {
    v += c.charCodeAt(0);
    v *= 17;
    v = v % 256;
    return v;
  });
  return v;
});
console.log("Part 1: ", hashes.sum());

// part 1
