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

const getPermutations = (s: string, g: number[], pattern: string) => {
  const cache: { [key: string]: string[] } = {};
  const perms: string[] = [];
  const len = pattern.length;
  // console.log(s, g, len);

  const permute = (str: string, gI: number) => {
    const key = `${str.length}-${gI}`;
    // console.log("key", {
    //   key,
    //   str,
    //   gI,
    // });
    cache[key] ??= [] as string[];

    if (cache[key].length > 0) {
      console.log("cache hit", cache[key]);
      return cache[key];
    }

    const groups = g.slice(gI);
    const minLen = groups.reduce((acc, n) => acc + n + 1, 0) - 1;
    if (minLen + str.length > len) {
      cache[key].push([]);
      return [];
    }
    if (groups.length === 0) {
      if (str.length === len) {
        console.log("match");
        cache[key].push(str);
        perms.push(str);
        return [str];
      }
      if (str.length < len) {
        const v = `${str}${".".repeat(len - str.length)}`;
        cache[key].push(v);
        return [v];
      }
    }

    const group = g[gI];
    const endCh = groups.length > 1 ? "." : "";

    // console.log({
    //   str,
    //   gI,
    //   group,
    //   a: `${str}.`,
    //   b: `${str}${"#".repeat(group)}${endCh}`,
    // });
    permute(`${str}.`, gI);
    permute(`${str}${"#".repeat(group)}${endCh}`, gI + 1);
  };

  permute(s, 0);
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

const countMatches = (patterns: (readonly [string, number[]])[]) => {
  const p = patterns.slice(1, 2).map(([pattern, groups]) => {
    const arrs = getPermutations("", groups, pattern);
    console.log(arrs, pattern);
    const matches = matchPatterns(pattern, arrs);
    return matches;
  });
  return p.sum();
};

console.log(countMatches(p1Patterns));
// console.log(countMatches(p2Patterns));
