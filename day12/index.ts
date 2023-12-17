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

// const matchPattern = (pattern: string) => {
//   for (let i = 0; i < pattern.length; i++) {
//     if (pattern[i] === ".") {
//       if (option[i] !== ".") return false;
//     } else if (pattern[i] === "#") {
//       if (option[i] !== "#") return false;
//     }
//   }
// };

const getPermutations = (pattern: string, groups: number[]) => {
  let match = 0;
  let visited = new Set<string>();

  const q: { str: string; sI: number; gI: number }[] = [
    { str: "", sI: 0, gI: 0 },
  ];
  console.log(pattern, groups, pattern.length);

  while (q.length > 0) {
    const { str, sI, gI } = q.pop()!;
    const s = pattern[sI];

    const key = str + sI + gI;

    console.log(str, sI, gI, s);
    if (s === undefined) {
      if (str.length === pattern.length && gI === groups.length) {
        const l = str[str.length - 1];
        const p = pattern[pattern.length - 1];
        if (p === "?" || l === p) {
          match++;
          console.log("match", str);
        }
      }
      continue;
    }
    if (s === "." || s === "?") {
      q.push({ str: str + ".", sI: sI + 1, gI });
    }
    if (s === "#" || s === "?") {
      const g = groups[gI];
      if (g) {
        const spaceCh = gI === groups.length - 1 ? "" : ".";
        q.push({
          str: str + "#".repeat(g) + spaceCh,
          sI: sI + g + spaceCh.length,
          gI: gI + 1,
        });
      }
    }
  }

  console.log(match);
  return match;
};

getPermutations(p1Patterns[0][0], p1Patterns[0][1]);
