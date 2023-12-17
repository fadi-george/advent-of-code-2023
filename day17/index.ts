import { AStar, type Position, readInput } from "../helpers";

const dir = import.meta.dir;
const lines = readInput(dir, "\n");

// const heatGrid: number[][] = [];
lines.forEach((line, rI) => {
  // heatGrid.push(line.split("").map(Number));
});

// Define start and target positions
const grid = [
  [4, 2, 1, 1],
  [2, 1, 1, 1],
  [1, 1, 1, 1],
];
// const start: Position = { x: grid[0].length, y: 0 };
// const end: Position = {
//   x: 0,
//   y: grid.length - 1,
// };
const startPos: Position = { x: 0, y: 0 };
const targetPos: Position = { x: 3, y: 2 };
console.log(grid, startPos, targetPos);

// Find the path

const aStar = new AStar(grid, { diagonals: false, stepDirLimit: null });
const path = aStar.findPath(startPos, targetPos);
console.log(
  "Path:",
  path.map((node) => node.position)
);
