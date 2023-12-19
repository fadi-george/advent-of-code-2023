import { readInput } from "../helpers";

const dir = import.meta.dir;
const workflows: Record<string, Function[]> = {};

const [w, ratings] = readInput(dir, "\n\n");

w.split("\n").forEach((line) => {
  let [, name, r] = line.match(/(.*)\{(.*)\}/)!;
  workflows[name] = [];
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
  });

  const lastC = rArr[rArr.length - 1];
  workflows[name].push(() => {
    if (lastC === "R") return "reject";
    if (lastC === "A") return "accept";
    return lastC;
  });
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
console.log(p1);
