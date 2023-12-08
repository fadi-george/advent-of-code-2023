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

const countSteps = (start: string, cond: (curr: string) => boolean) => {
  let curr = start;
  let dirI = 0;
  let currDir: "L" | "R" = dirs[0];
  let steps = 0;

  if (curr in maps) {
    while (cond(curr)) {
      steps++;

      const [l, r] = maps[curr];
      curr = currDir === "L" ? l : r;

      currDir = dirs[++dirI] ?? dirs[(dirI = 0)]; // get next direction otherwise reset to first direction
    }
  }

  return steps;
};
console.log(
  "Part 1: ",
  countSteps("AAA", (n) => n !== "ZZZ")
);

// part 2
const minsSteps = Object.keys(maps) // get nodes that start with A
  .filter((m) => m[2] === "A")
  .map((m) => countSteps(m, (n) => n[2] !== "Z")); // stop at nodes that end with Z
console.log("Part 2: ", minsSteps.reduce(lcm));
