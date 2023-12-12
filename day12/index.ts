import { readInput } from "../helpers";

const dir = import.meta.dir;
const lines = readInput(dir);

const patterns = lines.map((line, rI) => {
  const [pattern, groups] = line.split(" ");
  return [pattern, groups.split(",").map(Number)] as const;
});
// console.log(patterns);

const arrangements: number[] = [];

const getPermutations = (str: string, groups: number[], len: number) => {
  // console.log(str, groups, len);
  // if (str.length === len) return [str];

  const minLen = groups.reduce((acc, n) => acc + n + 1, 0) - 1;
  if (minLen + str.length > len) return [];
  if (groups.length === 0) {
    if (str.length === len) return [str];
    if (str.length < len) return [`${str}${".".repeat(len - str.length)}`];
    return [];
  }

  const perms: string[] = [];
  const group = groups[0];

  const endCh = groups.length > 1 ? "." : "";
  perms.push(
    ...getPermutations(
      `${str}${"#".repeat(group)}${endCh}`,
      groups.slice(1),
      len
    ),
    ...getPermutations(`${str}.`, groups, len)
  );

  return perms;
};

const matchPatterns = (pattern: string, options: string[]) => {
  const matches = options.filter((option) => {
    for (let i = 0; i < pattern.length; i++) {
      if (pattern[i] === ".") {
        if (option[i] !== ".") return false;
      } else if (pattern[i] === "#") {
        if (option[i] !== "#") return false;
      }
    }
    return true;
  });
  return matches.length;
};

const p1 = patterns.map(([pattern, groups]) => {
  const arrs = getPermutations("", groups, pattern.length);
  const matches = matchPatterns(pattern, arrs);
  return matches;
});

console.log(p1.sum());
