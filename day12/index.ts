import { readInput } from "../helpers";

const dir = import.meta.dir;
const lines = readInput(dir);

type Patterns = [string, number[]][];

const p1Patterns: Patterns = [];
const p2Patterns: Patterns = [];

lines.map((line, rI) => {
  const [pattern, groups] = line.split(" ");
  p1Patterns.push([pattern, groups.split(",").map(Number)]);
  p2Patterns.push([
    (pattern + "?").repeat(5),
    new Array(5).fill(groups.split(",").map(Number)).flat(),
  ]);
});

// const isPatternMatch = (pattern: string, option: string) => {
//   for (let i = 0; i < pattern.length; i++) {
//     if (pattern[i] === ".") {
//       if (option[i] !== ".") return false;
//     } else if (pattern[i] === "#") {
//       if (option[i] !== "#") return false;
//     }
//   }
//   return true;
// };

// let visited = new Set<string>();
let cache: { [key: string]: number } = {};
const getPermutations = (pattern: string, groups: number[]) => {
  if (pattern.length === 0) return groups.length === 0 ? 1 : 0;
  // if (groups.length === 0) return pattern.includes("#") ? 0 : 1;

  const s = pattern[0];
  const key = `${pattern}-${groups.toString()}`;

  // if (cache[key]) return cache[key];

  let res = 0;
  if (s === "." || s === "?") res += getPermutations(pattern.slice(1), groups);
  if (s === "#" || s === "?") {
    const g = groups[0];
    // if (!g) return 0;

    const spaceCh = groups.length === 1 ? "" : "."; // no space for last group
    const str = "#".repeat(g) + spaceCh;
    // console.log("1", { g, str, pl: pattern.length, pattern });
    if (str.length > pattern.length) return 0; // too long to fit #s

    const notValid = [...str].some(
      (c, i) => pattern[i] !== "?" && c !== pattern[i]
    );
    // console.log("2", { notValid });
    // if (notValid) return 0;
    if (!notValid)
      res += getPermutations(pattern.slice(str.length), groups.slice(1));
    // console.log("3", { res });
  }
  console.log("4", { res });

  return res;
};

const countMatches = (patterns: Patterns) => {
  // const matches = patterns
  //   .slice(2, 3)
  //   .map(([pattern, groups]) => getPermutations(pattern, groups));

  const [pattern, groups] = patterns[2];
  console.log("???", [getPermutations(pattern, groups)]);
  // return matches.sum();
};

// part 1
console.log("Part 1: ", countMatches(p1Patterns));

// part 2
// console.log("Part 2: ", countMatches(p2Patterns));
