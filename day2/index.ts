import { readInput } from "../helpers";

const dir = import.meta.dir;
const data = readInput(dir);

const buckets = {
  red: 12,
  green: 13,
  blue: 14,
};

const validIDs: number[] = [];
const powers: number[] = [];
data.forEach((line) => {
  const [, id, ...rest] = line.split(/Game |;|: /);
  let valid = true;
  const minBuckets = {
    red: 0,
    green: 0,
    blue: 0,
  };

  // game
  rest.forEach((item) => {
    [...item.matchAll(/(\d+) (red|blue|green)/g)].forEach(
      ([, count, color]) => {
        const c = +count;
        if (c > buckets[color as keyof typeof buckets]) {
          valid = false;
        }

        if (c > minBuckets[color as keyof typeof minBuckets]) {
          minBuckets[color as keyof typeof minBuckets] = c;
        }
      }
    );
  });

  if (valid) validIDs.push(+id);
  powers.push(minBuckets.red * minBuckets.green * minBuckets.blue);
});
const p1 = validIDs.reduce((a, b) => a + b, 0);
console.log(p1);

const p2 = powers.reduce((a, b) => a + b, 0);
console.log(p2);
