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

type SeedMap = {
  src: number[];
  diff: number;
};
const seedsMap: Record<RuleType, SeedMap[]> = {
  "seed-to-soil": [],
  "soil-to-fertilizer": [],
  "fertilizer-to-water": [],
  "water-to-light": [],
  "light-to-temperature": [],
  "temperature-to-humidity": [],
  "humidity-to-location": [],
};

// get mappings
let min = 0;
let max = Infinity;
lines.forEach((section, i) => {
  if (i === 0) {
    const vals = section.match(/(\d+)/g)?.map(Number);
    if (vals) {
      seeds.push(...vals);

      // p2 seeds
      const ranges = [];
      for (let i = 0; i < vals.length - 1; i = i + 2) {
        const start = vals[i];
        const range = vals[i + 1];
        ranges.push([start, start + range - 1]);
      }

      p2seeds.push(...ranges);
    }
  } else {
    const ruleType = section.match(/(.*)\ /)?.[1] as RuleType;
    const rules = section.match(/(\d+) (\d+) (\d+)/g);
    if (rules && ruleType) {
      rules.forEach((rule) => {
        const values = rule.split(" ").map(Number);
        const [dStart, sStart, r] = values;

        seedsMap[ruleType].push({
          src: [sStart, sStart + r - 1],
          diff: dStart - sStart,
        });
      });
      seedsMap[ruleType].sort((a, b) => a.src[0] - b.src[0]);
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

// p2 - brute force
// let found = false;
// const newOrder = order.toReversed();
// let p2 = 0;
// while (!found) {
//   let seed = p2;

//   newOrder.forEach((ruleType) => {
//     const foundSeed = seedsMap[ruleType as RuleType].find((s) => {
//       const [start, end] = s.src.map((v) => v + s.diff);
//       return seed >= start && seed <= end;
//     });

//     if (foundSeed) {
//       seed = seed - foundSeed.diff;
//     }
//   });

//   p2seeds.forEach(([start, end]) => {
//     if (seed >= start && seed <= end) {
//       found = true;
//     }
//   });

//   if (found) {
//     break;
//   }
//   p2++;
// }
// console.log(p2);

// for (let i = 0; i < 99; i++) {
//   console.log(i, getSeedLocations([i]));
// }

// p2 - ordered approach
// add missing intervals e.g. add [0 - 49] which maps to [0 - 49]
order.forEach((ruleType) => {
  const map = seedsMap[ruleType as RuleType];
  let start = min;
  let cap = max;

  const newIntervals = [];
  while (start < max) {
    let found: SeedMap | null = null;
    let capSet = false;

    for (let i = 0; i < map.length; i++) {
      const s = map[i];
      const [sStart, sEnd] = s.src;

      if (start < sStart && !capSet) {
        cap = sStart;
        capSet = true;
      }
      if (start >= sStart && start <= sEnd) {
        found = s;
        break;
      }
    }
    if (!capSet) cap = max + 1;

    if (found) {
      start = found.src[1] + 1;
    } else {
      newIntervals.push({
        src: [start, cap - 1],
        diff: 0,
      });
      start = cap;
    }
  }
  map.push(...newIntervals);
  map.sort((a, b) => a.src[0] - b.src[0]);
});

// find intervals by working backwards
// for [0 - 55] (locations) we get [70, 70], [26, 43], [82, 91], (seeds) ...
// i.e. for seed 70 we get 0 for location
const newOrder = order.toReversed();
let startArr = seedsMap["humidity-to-location"]
  .map((v) => {
    const [s, e] = v.src;
    return [s + v.diff, e + v.diff];
  })
  .sort((a, b) => a[0] - b[0]);

let p2;
for (const sA of startArr) {
  let nextArr = [sA];

  newOrder.slice(1).forEach((ruleType) => {
    const tmp: [number, number][] = [];
    for (let i = 0; i < nextArr.length; i++) {
      const [sStart, sEnd] = nextArr[i];
      const startRange = seedsMap[ruleType as RuleType].find((r) => {
        const [s, e] = r.src.map((v) => v + r.diff);
        return sStart >= s && sStart <= e;
      })!;

      const [s, e] = startRange.src;
      const diff = startRange.diff;

      if (sEnd - diff < e) {
        tmp.push([sStart - diff, sEnd - diff]);
      } else if (sEnd - diff > e) {
        tmp.push([sStart - diff, e]);
        nextArr.push([e + diff + 1, sEnd]);
      } else {
        tmp.push([s, e]);
      }
    }
    nextArr = tmp;
  });

  // check for intersections
  // sorting so we can determine lengths of intervals and subtract from the seed-range
  // e.g. for locations [0 - 50], we have seed ranges [0 - 13] [14 - 14] [15 - 21] ...
  // if p2 seed range was in [15 - 21] then the location mapped would be 13 + 1 + (# - 15 + 1)
  nextArr.sort((a, b) => a[0] - b[0]);

  p2seeds.some(([s, e]) => {
    let len = 0;
    return nextArr.some(([start, end]) => {
      // start of one interval could be before, on, or after the start of the other
      const found = s <= start && e >= start && s <= end;
      if (found) {
        p2 = Math.max(start, s) - start + len + 1;
        console.log(p2);
      } else {
        len += end - start + 1;
      }
      return found;
    });
  });
}
console.log(p2);
