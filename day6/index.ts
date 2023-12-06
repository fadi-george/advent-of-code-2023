import { readInput } from "../helpers";

const dir = import.meta.dir;
const lines = readInput(dir, "\n");

const times = lines[0].match(/\d+/g)?.map(Number)!;
const distances = lines[1].match(/\d+/g)?.map(Number)!;

const getScores = (timeArr: number[], distArr: number[]) => {
  const res: number[] = [];
  for (let i = 0; i < timeArr.length; i++) {
    const time = timeArr[i];
    const distance = distArr[i];

    // quadratic approach
    const r1 = (time + Math.sqrt(time * time - 4 * distance)) / 2;
    const r2 = (time - Math.sqrt(time * time - 4 * distance)) / 2;

    res.push(Math.ceil(r1) - Math.floor(r2) - 1);
  }

  return res;
};

const p1 = getScores(times, distances).reduce((acc, v) => acc * v);
console.log(p1);

const p2 = getScores([+times.join("")], [+distances.join("")]).product();
console.log(p2);
