import fs from "fs";
import path from "path";

Array.prototype.sum = function () {
  return this.reduce((a, b) => a + b, 0);
};
Array.prototype.product = function () {
  return this.reduce((a, b) => a * b, 1);
};

export const readInput = (dir: string, regex = "\n") => {
  return fs
    .readFileSync(
      path.join(dir, `${import.meta.env.input || "input"}.txt`),
      "utf8"
    )
    .split(regex);
};
