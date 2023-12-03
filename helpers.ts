import fs from "fs";
import path from "path";

export const readInput = (dir: string, regex = "\n") => {
  return fs
    .readFileSync(path.join(dir, `${import.meta.input || "input"}.txt`), "utf8")
    .split(regex);
  return [];
};
