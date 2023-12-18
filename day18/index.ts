import { Point, readInput } from "../helpers";
import { shoelaceFormula as shoelace } from "../shoelace";

const dir = import.meta.dir;
const lines = readInput(dir, "\n");

const dirMap = {
  "0": "R",
  "1": "D",
  "2": "L",
  "3": "U",
};

type Instructions = [string, number][];
const p1Ins: Instructions = [];
const p2Ins: Instructions = [];

lines.forEach((line) => {
  let [, dir, n, hex] = line.match(/([A-Z]) (\d+) \((.*)\)/)!;
  p1Ins.push([dir, +n]);
  p2Ins.push([
    dirMap[hex[hex.length - 1] as keyof typeof dirMap], // determine direction
    parseInt(hex.substring(1, 6), 16), // get encoded distance
  ]);
});

const getArea = (ins: Instructions) => {
  // get polygon points
  let perimeter = 0;
  let r = 0;
  let c = 0;
  let points: Point[] = [{ y: r, x: c }];

  for (let [d, n] of ins) {
    if (d === "R") c += n;
    else if (d === "L") c -= n;
    else if (d === "D") r += n;
    else if (d === "U") r -= n;
    points.push({ y: r, x: c });
    perimeter += n;
  }

  // shoelace adds half the boundary areas - 1, so we'll add the remaining perimeter plus 1
  const area = shoelace(points) + perimeter / 2 + 1;
  console.log(area);
};

// part 1
getArea(p1Ins);
getArea(p2Ins);
