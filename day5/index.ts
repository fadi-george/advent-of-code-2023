import { readInput } from "../helpers";

const dir = import.meta.dir;
const lines = readInput(dir, "\n\n");

const seeds: number[] = [];
type RuleType =
  | "seed-to-soil"
  | "soil-to-fertilizer"
  | "fertilizer-to-water"
  | "water-to-light"
  | "light-to-temperature"
  | "temperature-to-humidity"
  | "humidity-to-location";

const seedsMap: Record<RuleType, { src: number[]; diff: number }[]> = {
  "seed-to-soil": [],
  "soil-to-fertilizer": [],
  "fertilizer-to-water": [],
  "water-to-light": [],
  "light-to-temperature": [],
  "temperature-to-humidity": [],
  "humidity-to-location": [],
};

// get mappings
lines.forEach((section, i) => {
  if (i === 0) {
    const seedVals = section.match(/(\d+)/g)?.map(Number);
    if (seedVals) seeds.push(...seedVals);
  } else {
    const ruleType = section.match(/(.*)\ /)?.[1] as RuleType;
    const rules = section.match(/(\d+) (\d+) (\d+)/g);
    if (rules && ruleType) {
      rules.forEach((rule) => {
        const [dStart, sStart, r] = rule.split(" ").map(Number);
        seedsMap[ruleType].push({
          src: [sStart, sStart + r],
          diff: dStart - sStart,
        });
      });
    }
  }
});

// get locations values
let resArr: number[] = seeds;
[
  "seed-to-soil",
  "soil-to-fertilizer",
  "fertilizer-to-water",
  "water-to-light",
  "light-to-temperature",
  "temperature-to-humidity",
  "humidity-to-location",
].forEach((ruleType) => {
  resArr = resArr.map((seed) => {
    const match = seedsMap[ruleType as RuleType].find((s) => {
      const [start, end] = s.src;
      return seed >= start && seed <= end;
    });

    if (match) {
      return seed + match.diff;
    } else {
      return seed;
    }
  });
});
const p1 = Math.min(...resArr);
console.log(p1);
