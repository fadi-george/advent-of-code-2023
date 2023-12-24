import { readInput } from "../helpers";

const dir = import.meta.dir;

type Category = "x" | "m" | "a" | "s";

type Rule = [string, string, number, string];

const workflows: Record<string, Rule[]> = {};

const [w, ratings] = readInput(dir, "\n\n");

w.split("\n").forEach((line) => {
  let [, name, r] = line.match(/(.*)\{(.*)\}/)!;
  workflows[name] = [];

  const rules = r.split(",");
  rules.slice(0, rules.length - 1).forEach((c) => {
    // store rules as [category, operator, value, 'R' | 'A' or next workflow name]
    const [_, cat, op, val, ret] = c.match(/([xmas])(\>|\<)(\d+)\:(.*)/)!;
    workflows[name].push([cat as Category, op, +val, ret]);
  });
  workflows[name].push([rules[rules.length - 1], "", 0, ""]);
});

const params: [number, number, number, number][] = [];
ratings.split("\n").forEach((line, rI) => {
  const p = line.substring(1, line.length - 1).split(",");
  params[rI] ??= [0, 0, 0, 0];
  p.forEach((v, i) => {
    const tmp = v.split("=");
    params[rI][i] = +tmp[1];
  });
});

const cMap = {
  x: 0,
  m: 1,
  a: 2,
  s: 3,
};

const checkPart = (
  workflowID: string,
  p: [number, number, number, number]
): boolean => {
  const workflow = workflows[workflowID];
  for (const [cat, op, val, ret] of workflow) {
    if (cat === "R") return false;
    if (cat === "A") return true;
    if (!op) return checkPart(cat, p);

    const cI = cMap[cat as keyof typeof cMap];
    if ((op === ">" && p[cI] > val) || (op === "<" && p[cI] < val)) {
      if (ret === "A") return true;
      if (ret === "R") return false;
      return checkPart(ret, p);
    }
  }

  return false;
};

const p1 = params
  .filter((p) => checkPart("in", p))
  .reduce((a, p) => a + p.sum(), 0);
console.log("Part 1: ", p1);

// calculates combinations of ranges, if min > max it'll just return 0
const getMinTotals = (m: number[][]) =>
  m.reduce((a, [min, max]) => a * (max - min + 1), 1);

type Ranges = Record<"x" | "m" | "a" | "s", [number, number]>;
let countPossible = (wID: string, ranges: Ranges, c: string[]): number => {
  if (wID === "A") return getMinTotals(Object.values(ranges));
  if (wID === "R") return 0;

  const workflow = workflows[wID];
  let res = 0;

  const r = { ...ranges };

  for (let i = 0; i < workflow.length; i++) {
    const [cat, op, val, ret] = workflow[i];

    if (op) {
      const c = cat as Category;
      const [minV, maxV] = r[c];

      if (op === ">") {
        if (maxV > val) {
          r[c] = [val + 1, maxV];

          // condition needs to be true so should update conditions
          res += countPossible(ret, { ...r, [c]: [val + 1, maxV] }, [
            ...c,
            ret,
          ]);
        }
        // otherwise, condition needs to be false
        r[c] = [minV, val];
      } else if (op === "<") {
        if (minV < val) {
          res += countPossible(
            ret,
            {
              ...r,
              [c]: [minV, val - 1],
            },
            [...c, ret]
          );
        }
        r[c] = [val, maxV];
      }
    } else {
      res += countPossible(cat, r, [...c, cat]);
    }
  }

  return res;
};

const p2 = countPossible(
  "in",
  {
    x: [1, 4000],
    m: [1, 4000],
    a: [1, 4000],
    s: [1, 4000],
  },
  ["in"]
);
console.log("Part 2: ", p2);
