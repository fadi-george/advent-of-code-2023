import { readInput } from "../helpers";

const dir = import.meta.dir;
const data = readInput(dir);

const group = `one|two|three|four|five|six|seven|eight|nine|zero|\\d`;
const regex = new RegExp(`(${group})(?:.*(${group}))?`);

const numberMap = {
  one: "1",
  two: "2",
  three: "3",
  four: "4",
  five: "5",
  six: "6",
  seven: "7",
  eight: "8",
  nine: "9",
  zero: "0",
};

const res = data
  .map((line) => {
    let [_, a, b] = line.match(regex) ?? [];
    if (!b) b = a;

    if (a in numberMap) a = numberMap[a as keyof typeof numberMap];
    if (b in numberMap) b = numberMap[b as keyof typeof numberMap];

    return Number(a + b);
  })
  .reduce((a, b) => a + b, 0);
console.log(res);
