import { readInput } from "../helpers";

const dir = import.meta.dir;
const data = readInput(dir);

const buckets = {
  red: 12,
  green: 13,
  blue: 14,
};

const validIDs: number[] = [];
data.forEach((line) => {
  const [, id, ...rest] = line.split(/Game |;|: /);

  const valid = rest.every((item) => {
    return [...item.matchAll(/(\d+) (red|blue|green)/g)].every(
      ([, count, color]) => {
        const c = +count;
        return c <= buckets[color as keyof typeof buckets];
      }
    );
  });
  if (valid) validIDs.push(+id);
});
const res = validIDs.reduce((a, b) => a + b, 0);
console.log(res);
