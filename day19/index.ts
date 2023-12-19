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

// const cMap = {
//   x: 0,
//   m: 1,
//   a: 2,
//   s: 3,
// };

// let minRanges = [4000, 4000, 4000, 4000];
// // const workflow = workflowRanges["in"];

// const getMinRange = (wID: string, ranges: number[]) => {
//   const workflow = workflowRanges[wID];
//   const elseC = workflow[workflow.length - 1][0];
//   let hasACase = false;

//   for (let i = 0; i < workflow.length - 1; i++) {
//     const [cat, op, val, ret] = workflow[i];
//     let ci = cMap[cat as keyof typeof cMap]; // get index of category

//     // else case
//     if (cat === "A") {
//       // ???
//       break;
//     }

//     // min range doesn't change
//     if (ret === "A" && elseC === "A") {
//       continue;
//     }

//     if (ret === "A") {
//       // min range changes
//       if (op === ">") ranges[ci] = 4000 - val;
//       else if (op === "<") ranges[ci] = val - 1;
//       continue;
//     }

//     if (ret === "R") continue;

//     getMinRange(ret, ranges);
//   }

//   // // check opposite conditions of preceding rules
//   // if (elseC === "A" && !hasACase) {
//   //   for (let i = 0; i < workflow.length - 1; i++) {
//   //     const [cat, op, val] = workflow[i];
//   //     let ci = cMap[cat as keyof typeof cMap]; // get index of category

//   //     if (op === ">") ranges[ci] = val;
//   //     else if (op === "<") ranges[ci] = 4000 - val + 1;
//   //   }
//   // }
// };

// getMinRange("in", [4000, 4000, 4000, 4000], ["x", "m", "a", "s"]);

// const getMinRange = (wID: string, ranges: number[]) => {
//   const workflow = workflowRanges[wID];
//   const elseC = workflow[workflow.length - 1][0];
//   let hasACase = false;

//   for (let i = 0; i < workflow.length - 1; i++) {
//     const [cat, op, val, ret] = workflow[i];
//     let ci = cMap[cat as keyof typeof cMap]; // get index of category

//     // min range doesn't change
//     if (ret === "A" && elseC === "A") {
//       hasACase = true;
//       continue;
//     }

//     if (ret === "A") {
//       // min range changes
//       if (op === ">") ranges[ci] = 4000 - val;
//       else if (op === "<") ranges[ci] = val - 1;
//       continue;
//     }

//     if (ret === "R") continue;

//     getMinRange(ret, ranges);
//   }

//   // check opposite conditions of preceding rules
//   if (elseC === "A" && !hasACase) {
//     for (let i = 0; i < workflow.length - 1; i++) {
//       const [cat, op, val] = workflow[i];
//       let ci = cMap[cat as keyof typeof cMap]; // get index of category

//       if (op === ">") ranges[ci] = val;
//       else if (op === "<") ranges[ci] = 4000 - val + 1;
//     }
//   }
// };

// const minRanges = Object.keys(workflowRanges).map((w) => {
//   let cMins = [4000, 4000, 4000, 4000];

//   getMinRange(w, cMins);

//   return cMins;
// });
// console.log(minRanges);

// for (let i = 0; i < workflow.length - 1; i++) {
//   const [cat, op, val, ret] = workflow[i];
//   let ci = cMap[cat as keyof typeof cMap]; // get index of category

//   // min range doesn't change
//   if (ret === "A") continue;

//   if (ret === "R") {
//     // min range changes
//     if (op === ">") miNRanges[ci] = 4000 - val;
//     else if (op === "<") miNRanges[ci] = val - 1;
//     continue;
//   }
// }
