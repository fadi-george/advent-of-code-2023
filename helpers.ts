import fs from "fs";
import path from "path";

export const readInput = (
  dir: string,
  {
    useSample = false,
    sampleName = "sample",
    regex = "\n",
  }: { useSample?: boolean; sampleName?: string; regex?: string } = {}
) => {
  const textPath = useSample ? `${sampleName}.txt` : "input.txt";
  return fs.readFileSync(path.join(dir, textPath), "utf8").split(regex);
  return [];
};
