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

// Greatest Common Divisor (GCD)
const gcd = (a: number, b: number) => {
  // Calculate the Greatest Common Divisor (GCD) using Euclid's algorithm
  while (b !== 0) {
    const temp = b;
    b = a % b;
    a = temp;
  }
  return a;
};

// Least Common Multiple (LCM)
export const lcm = (a: number, b: number) => {
  return (a * b) / gcd(a, b);
};
