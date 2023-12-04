import fs from "fs";
import path from "path";

export const readInput = (dir: string, regex = "\n") => {
  return fs
    .readFileSync(
      path.join(dir, `${import.meta.env.input || "input"}.txt`),
      "utf8"
    )
    .split(regex);
};

export const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0);
