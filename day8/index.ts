import { lcm, readInput } from "../helpers";

const dir = import.meta.dir;
const lines = readInput(dir, "\n\n");

const maps: Record<string, [string, string]> = {};

const dirs = lines[0] as unknown as ("R" | "L")[];

// part 1
lines[1].split("\n").forEach((line) => {
  const [_, p, l, r] = line.match(/(\w+) = \((\w+)\, (\w+)\)/)!;
  maps[p] = [l, r];
});

let curr = "AAA";
let dirI = 0;
let currDir: "L" | "R" = dirs[0];
let steps = 0;

if (curr in maps) {
  while (curr !== "ZZZ") {
    steps++;

    const [l, r] = maps[curr];
    curr = currDir === "L" ? l : r;

    dirI++;
    currDir = dirs[dirI];
    if (!currDir) {
      currDir = dirs[0];
      dirI = 0;
    }
  }
  console.log(steps);
}

// part 2
let currNodes = Object.keys(maps).filter((m) => m[2] === "A");
const minSteps = currNodes.map((node, i) => {
  curr = node;
  steps = 0;
  currDir = dirs[0];
  dirI = 0;

  while (curr[2] !== "Z") {
    steps++;

    const [l, r] = maps[curr];
    curr = currDir === "L" ? l : r;

    dirI++;
    currDir = dirs[dirI];
    if (!currDir) {
      currDir = dirs[0];
      dirI = 0;
    }
  }

  return steps;
});
