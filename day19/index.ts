import { readInput } from "../helpers";

const dir = import.meta.dir;
const workflows: Record<string, Function[]> = {};
const workflowRanges: Record<string, [string, string, number, string][]> = {};

const [w, ratings] = readInput(dir, "\n\n");

w.split("\n").forEach((line) => {
  let [, name, r] = line.match(/(.*)\{(.*)\}/)!;
  workflows[name] = [];
  workflowRanges[name] = [];

  const rArr = r.split(",");
  rArr.slice(0, rArr.length - 1).forEach((c) => {
    const [_, cat, op, val, ret] = c.match(/([xmas])(\>|\<)(\d+)\:(.*)/)!;

    workflows[name].push((x: number, m: number, a: number, s: number) => {
      let _var = { x: x, m: m, a: a, s: s }[cat]!;
      let _val = +val;
      let cond = { ">": _var > _val, "<": _var < _val }[op];

      if (cond) {
        if (ret === "R") return "reject";
        if (ret === "A") return "accept";
        return ret;
      }
      return false;
    });

    workflowRanges[name].push([cat, op, +val, ret]);
  });

  const lastC = rArr[rArr.length - 1];
  workflowRanges[name].push([lastC]);
  workflows[name].push(() => {
    if (lastC === "R") return "reject";
    if (lastC === "A") return "accept";
    return lastC;
  });

  if (lastC === "A") {
    workflowRanges[name] = workflowRanges[name].filter(
      ([, , , ret]) => ret !== "A"
    );
  }
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

const checkPart = (p: [number, number, number, number]) => {
  // start at first workflow
  let v: string | false = "";
  let workflowID = "in";

  while (1) {
    const workflow = workflows[workflowID];
    for (let i = 0; i < workflow.length; i++) {
      v = workflow[i](...p);
      if (v === "accept") return true;
      if (v === "reject") return false;
      if (v !== false) break; // check different workflow
      // otherwise check next condition
    }
    if (v) workflowID = v;
  }
};

const p1 = params.filter(checkPart).reduce((a, p) => a + p.sum(), 0);
console.log("Part 1: ", p1);

let minRanges: number[][][] = [];
let q = [
  {
    mins: [
      [1, 4000],
      [1, 4000],
      [1, 4000],
      [1, 4000],
    ],
    wID: "in",
    chain: ["in"], // debug
  },
];
const cMap = {
  x: 0,
  m: 1,
  a: 2,
  s: 3,
};

console.log(workflowRanges);
while (q.length) {
  const { wID, mins, chain } = q.shift()!;

  const workflow = workflowRanges[wID];

  // const elseC = workflow[workflow.length - 1][0];
  // let foundA = false;
  for (let i = 0; i < workflow.length; i++) {
    const [cat, op, val, ret] = workflow[i];

    // the else case rule
    if (cat === "A") {
      console.log("hmm", mins, chain);
      minRanges.push(mins);
      continue;
    }
    if (cat === "R") continue;
    if (!op) {
      q.push({ mins, wID: cat, chain: [...chain, cat] });
      continue;
    }

    // regular rules
    let cI = cMap[cat as keyof typeof cMap];
    let [minV, maxV] = mins[cI];
    if (op === ">") {
      if (maxV > val) {
        const newMins = mins.with(cI, [val + 1, maxV]);
        if (ret === "A") {
          console.log("hmm", newMins, chain);
          minRanges.push(newMins);
        } else if (ret !== "R") {
          q.push({ mins: newMins, wID: ret, chain: [...chain, ret] });
        }
      }
    } else if (op === "<") {
      if (minV < val) {
        const newMins = mins.with(cI, [minV, val - 1]);
        if (ret === "A") {
          console.log("hmm", newMins, chain);
          minRanges.push(newMins);
        } else if (ret !== "R") {
          q.push({ mins: newMins, wID: ret, chain: [...chain, ret] });
        }
      }
    }
  }
}
const p2 = minRanges.reduce((acc, ints) => {
  return acc + ints.reduce((a, [min, max]) => a * (max - min + 1), 1);
}, 0);
console.log(p2);
