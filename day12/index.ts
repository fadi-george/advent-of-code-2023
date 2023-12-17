import { readInput } from "../helpers";

const dir = import.meta.dir;
const lines = readInput(dir);

type Patterns = [string, number[]][];

const p1Patterns: Patterns = [];
const p2Patterns: Patterns = [];

lines.map((line, rI) => {
  const [pattern, g] = line.split(" ");
  const groups = g.split(",").map(Number);
  p1Patterns.push([pattern, groups]);
  p2Patterns.push([[pattern].repeat(5).join("?"), groups.repeat(5)]); // repeat pattern 5 times
});

let cache: { [key: string]: number } = {};

const getPermutations = (pattern: string, groups: number[]) => {
  if (pattern.length === 0) return +(groups.length === 0);
  if (groups.length === 0) return +!pattern.includes("#");

  const s = pattern[0];
  const key = `${pattern}-${groups.toString()}`;

  if (cache[key] !== undefined) return cache[key];
  let res = 0;

  // continue checking rest
  if (s === "." || s === "?") res += getPermutations(pattern.slice(1), groups);
  if (s === "#" || s === "?") {
    const g = groups[0];
    const str = "#".repeat(g) + (pattern.length === g ? "" : ".");

    if ([...str].every((c, i) => pattern[i] === "?" || pattern[i] === c))
      res += getPermutations(pattern.slice(g + 1), groups.slice(1));
  }

  cache[key] = res;
  return res;
};

const countMatches = (patterns: Patterns) =>
  patterns.map(([pattern, groups]) => getPermutations(pattern, groups)).sum();

// part 1
console.log("Part 1: ", countMatches(p1Patterns));

// part 2
console.log("Part 2: ", countMatches(p2Patterns));
