import { readInput } from "../helpers";

const dir = import.meta.dir;
const lines = readInput(dir, "\n\n");

const seeds: number[] = [];
const p2seeds: number[][] = [];
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
    const vals = section.match(/(\d+)/g)?.map(Number);
    if (vals) {
      seeds.push(...vals);

      const ranges = [];
      for (let i = 0; i < vals.length - 1; i = i + 2) {
        const start = vals[i];
        const range = vals[i + 1];
        ranges.push([start, start + range - 1]);
      }

      // optimize ranges
      for (let i = 0; i < ranges.length; i++) {
        const [start, end] = ranges[i];
        for (let j = i + 1; j < ranges.length; j++) {
          const [start2, end2] = ranges[j];
          if (start2 >= start && start2 <= end) {
            ranges[i][1] = Math.max(end, end2);
            ranges.splice(j, 1);
            j--;
          }
        }
      }
      p2seeds.push(...ranges);
    }
  } else {
    const ruleType = section.match(/(.*)\ /)?.[1] as RuleType;
    const rules = section.match(/(\d+) (\d+) (\d+)/g);
    if (rules && ruleType) {
      rules.forEach((rule) => {
        const [dStart, sStart, r] = rule.split(" ").map(Number);
        seedsMap[ruleType].push({
          src: [sStart, sStart + r - 1],
          diff: dStart - sStart,
        });
      });
    }
  }
});

// get locations values
const order = [
  "seed-to-soil",
  "soil-to-fertilizer",
  "fertilizer-to-water",
  "water-to-light",
  "light-to-temperature",
  "temperature-to-humidity",
  "humidity-to-location",
];
const getSeedLocations = (startArr: number[]) => {
  let resArr: number[] = startArr;
  order.forEach((ruleType) => {
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
  return resArr;
};

const p1 = Math.min(...getSeedLocations(seeds));
console.log(p1);

p2seeds.sort((a, b) => a[1] - a[0] - (b[1] - b[0]));
// const visited = new Set<number>();
const p2Res = p2seeds.map((s) => {
  const seedsArr = [];
  for (let i = s[0]; i <= s[1]; i++) {
    // if (visited.has(i)) console.log("no way");
    // visited.add(i);
    seedsArr.push(i);
  }

  const temp = getSeedLocations(seedsArr);
  let min = Infinity;
  for (let i = 0; i < temp.length; i++) {
    if (temp[i] < min) {
      min = temp[i];
    }
  }
  return min;
});
const p2 = Math.min(...p2Res);
console.log(p2);
