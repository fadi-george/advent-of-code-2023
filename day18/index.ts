import { Point, readInput } from "../helpers";
import { shoelaceFormula } from "../shoelace";

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
  let perimeter = 0;

  // get polygon points
  let r = 0;
  let c = 0;
  let points: Point[] = [{ y: r, x: c }];

  for (let [d, n] of ins) {
    switch (d) {
      case "R":
        c += n;
        break;
      case "L":
        c -= n;
        break;
      case "D":
        r += n;
        break;
      case "U":
        r -= n;
        break;
    }
    points.push({ y: r, x: c });
    perimeter += n;
  }

  const area = shoelaceFormula(points) + perimeter / 2 + 1;
  console.log(area);
};

// part 1
getArea(p1Ins);
getArea(p2Ins);
