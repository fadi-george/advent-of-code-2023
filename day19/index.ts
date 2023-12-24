import { printGrid, readInput } from "../helpers";

const dir = import.meta.dir;
const workflows: Record<string, [string, string, number, string][]> = {};

const [w, ratings] = readInput(dir, "\n\n");

w.split("\n").forEach((line) => {
  let [, name, r] = line.match(/(.*)\{(.*)\}/)!;
  workflows[name] = [];

  const rules = r.split(",");
  rules.slice(0, rules.length - 1).forEach((c) => {
    const [_, cat, op, val, ret] = c.match(/([xmas])(\>|\<)(\d+)\:(.*)/)!;
    workflows[name].push([cat, op, +val, ret]);
  });

  // @ts-expect-error - this is fine
  workflows[name].push([rules[rules.length - 1]]);
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

const getMinTotals = (m: number[][]) =>
  m.reduce((a, [min, max]) => a * (max - min + 1), 1);

let countPossible = (r: string, m: number[][], c: string[]): number => {
  if (r === "A") return getMinTotals(m);
  if (r === "R") return 0;

  const workflow = workflows[r];
  let res = 0;

  const rules = workflow.slice(0, workflow.length - 1);
  const fallback = workflow[workflow.length - 1];
  let invalid = false;

  for (let i = 0; i < rules.length; i++) {
    const [cat, op, val, ret] = rules[i];
    const cI = cMap[cat as keyof typeof cMap];
    const [minV, maxV] = m[cI];
    const newMins = m.slice();

    let next: string | undefined = undefined;
    if (op === ">") {
      if (maxV > val) {
        if (ret === "R") continue;
        newMins[cI] = [val + 1, maxV];
        next = ret;
      }
    } else if (op === "<") {
      if (minV < val) {
        if (ret === "R") continue;
        newMins[cI] = [minV, val - 1];
        next = ret;
      }
    }

    if (next) {
      for (let j = i - 1; j >= 0; j--) {
        const [cat, op, val] = rules[j];
        const cI = cMap[cat as keyof typeof cMap];
        const [minV, maxV] = newMins[cI];

        // becomes ≤
        if (op === ">") {
          newMins[cI] = [minV, val];
          // becomes ≥
        } else if (op === "<") {
          newMins[cI] = [val, maxV];
        }
      }

      // if (newMins.some(([a, b]) => a > b)) {
      //   invalid = true;
      //   continue;
      // }
      res += countPossible(next, newMins, [...c, ret]);
    }
  }

  // if (invalid) {
  const [ret, i] = [fallback[0], rules.length];
  if (ret !== "R") {
    const newMins = m.slice();
    for (let j = i - 1; j >= 0; j--) {
      const [cat, op, val] = rules[j];
      const cI = cMap[cat as keyof typeof cMap];
      const [minV, maxV] = newMins[cI];

      // becomes ≤
      if (op === ">") {
        newMins[cI] = [minV, val];
        // becomes ≥
      } else if (op === "<") {
        newMins[cI] = [val, maxV];
      }
    }
    res += countPossible(ret, newMins, [...c, ret]);
  }
  // }

  return res;
};

const p2 = countPossible(
  "in",
  [
    [1, 4000],
    [1, 4000],
    [1, 4000],
    [1, 4000],
  ],
  ["in"]
);

// 164721176613604 high
console.log("Part 2: ", p2);
