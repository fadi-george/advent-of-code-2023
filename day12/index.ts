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

const getPermutations = (_str: string, _groups: number[], _len: number) => {
  const visited: { [key: string]: string } = {};
  const perms: string[] = [];

  const permute = (_str: string, _groups: number[], _len: number) => {
    const queues: {
      str: string;
      groups: number[];
      len: number;
    }[] = [
      {
        str: _str,
        groups: _groups,
        len: _len,
      },
    ];

    while (queues.length > 0) {
      const { str, groups, len } = queues.shift()!;

      const key = `${str}-${groups.join(",")}-${len}`;
      if (visited[key]) visited[key] = str;

      const minLen = groups.reduce((acc, n) => acc + n + 1, 0) - 1;
      if (minLen + str.length > len) continue;
      if (groups.length === 0) {
        if (str.length === len) {
          perms.push(str);
          visited[key] = str;
          continue;
        }
        if (str.length < len) {
          const v = `${str}${".".repeat(len - str.length)}`;
          perms.push(v);
          visited[key] = v;
          continue;
        }
      }

      const group = groups[0];
      const endCh = groups.length > 1 ? "." : "";
      queues.push({
        str: `${str}${"#".repeat(group)}${endCh}`,
        groups: groups.slice(1),
        len,
      });
      queues.push({
        str: `${str}.`,
        groups,
        len,
      });
    }
  };
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
  const p = patterns.map(([pattern, groups]) => {
    const arrs = getPermutations("", groups, pattern.length);
    const matches = matchPatterns(pattern, arrs);
    return matches;
  });
  return p.sum();
};

console.log(countMatches(p1Patterns));
console.log(countMatches(p2Patterns));
