import { readInput } from "../helpers";

const dir = import.meta.dir;
const lines = readInput(dir, "\n");

const times = lines[0].match(/\d+/g)?.map(Number)!;
const distances = lines[1].match(/\d+/g)?.map(Number)!;

const getScores = (timeArr: number[], distArr: number[]) => {
  const res = [];
  for (let i = 0; i < timeArr.length; i++) {
    const time = timeArr[i];
    const distance = distArr[i];

    const scores: number[] = [];

    for (let j = 0; j < time; j++) {
      const score = j * (time - j);
      scores.push(score);
    }
    res.push(scores.filter((score) => score > distance).length);
  }
  return res;
};

const p1 = getScores(times, distances).reduce((acc, v) => acc * v);
console.log(p1);

const p2 = getScores([+times.join("")], [+distances.join("")]).reduce(
  (acc, v) => acc * v
);
console.log(p2);
