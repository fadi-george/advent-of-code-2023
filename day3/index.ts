import { readInput } from "../helpers";

const dir = import.meta.dir;
const lines = readInput(dir);
const visitedIndices = new Set<number>();
const partNums: number[] = [];

lines.forEach((line, row) => {
  const symbols = [...line.matchAll(/[^\d|\.]/g)];
  if (symbols.length === 0) return;

  symbols.forEach((symbol) => {
    const col = symbol.index!;

    const neighbors = [
      [row - 1, col - 1], // top left
      [row - 1, col], // top
      [row - 1, col + 1], // top right
      [row, col - 1], // left
      [row, col + 1], // right
      [row + 1, col - 1], // bottom left
      [row + 1, col], // bottom
      [row + 1, col + 1], // bottom right
    ];

    neighbors.forEach(([r, c]) => {
      const neighbor = lines[r][c];

      if (neighbor === undefined || visitedIndices.has(r * line.length + c))
        return;
      if (!/\d/.test(neighbor)) return;

      let numStr = neighbor;
      visitedIndices.add(r * line.length + c);

      // reading leftwards
      for (let i = c - 1; i >= 0; i--) {
        const char = lines[r][i];
        if (/\d/.test(char)) {
          numStr = char + numStr;
          visitedIndices.add(r * line.length + i);
        } else {
          break;
        }
      }

      // reading rightwards
      for (let i = c + 1; i < line.length; i++) {
        const char = lines[r][i];
        if (/\d/.test(char)) {
          numStr += char;
          visitedIndices.add(r * line.length + i);
        } else {
          break;
        }
      }

      partNums.push(+numStr);
    });
  });
});

const res = partNums.reduce((a, b) => a + b, 0);
console.log(res);
