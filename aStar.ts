export type Position = {
  x: number;
  y: number;
};

type Direction = {
  x: number;
  y: number;
};

class Node {
  position: Position;
  cost: number;
  heuristic: number;
  total: number;
  parent: Node | null;
  directionFromParent: Direction | null;
  moveCost: number; // Cost to move through this node
  stepsInDirection: number;

  constructor(position: Position, moveCost: number = 0) {
    this.position = position;
    this.cost = Infinity;
    this.heuristic = 0;
    this.total = Infinity;
    this.parent = null;
    this.directionFromParent = null;
    this.stepsInDirection = 0;
    this.moveCost = moveCost;
  }

  setParent(parent: Node, direction: Direction): void {
    this.parent = parent;
    if (
      parent.directionFromParent &&
      parent.directionFromParent.x === direction.x &&
      parent.directionFromParent.y === direction.y
    ) {
      this.stepsInDirection = parent.stepsInDirection + 1;
      this.directionFromParent = direction;
    } else {
      this.stepsInDirection = 1;
      this.directionFromParent = direction;
    }
  }
}

export class AStar {
  private grid: Node[][];
  private diagonals: boolean;
  private stepDirLimit: number | null;

  constructor(
    grid: number[][],
    { diagonals = false, stepDirLimit = null } = {}
  ) {
    this.diagonals = diagonals;
    this.stepDirLimit = stepDirLimit;
    this.grid = this.createGrid(grid);
  }

  private createGrid(inputGrid: number[][]): Node[][] {
    return inputGrid.map((row, y) =>
      row.map((cost, x) => new Node({ x, y }, cost))
    );
  }

  private getNeighbors(node: Node): Node[] {
    const neighbors: Node[] = [];
    const { x, y } = node.position;

    // Direct neighbors (up, right, down, left)
    if (y > 0) neighbors.push(this.grid[y - 1][x]);
    if (x < this.grid[0].length - 1) neighbors.push(this.grid[y][x + 1]);
    if (y < this.grid.length - 1) neighbors.push(this.grid[y + 1][x]);
    if (x > 0) neighbors.push(this.grid[y][x - 1]);

    // Diagonal neighbors
    if (this.diagonals) {
      if (y > 0 && x > 0) neighbors.push(this.grid[y - 1][x - 1]);
      if (y > 0 && x < this.grid[0].length - 1)
        neighbors.push(this.grid[y - 1][x + 1]);
      if (y < this.grid.length - 1 && x < this.grid[0].length - 1)
        neighbors.push(this.grid[y + 1][x + 1]);
      if (y < this.grid.length - 1 && x > 0)
        neighbors.push(this.grid[y + 1][x - 1]);
    }

    if (this.stepDirLimit) {
      return neighbors.filter((neighbor) => {
        const dirToNeighbor = {
          x: neighbor.position.x - node.position.x,
          y: neighbor.position.y - node.position.y,
        };

        // Check if the direction change exceeds the step limit
        if (this.stepDirLimit) {
          if (
            node.directionFromParent &&
            node.directionFromParent.x === dirToNeighbor.x &&
            node.directionFromParent.y === dirToNeighbor.y &&
            node.stepsInDirection >= 3
          ) {
            return false;
          }
        }
        return true;
      });
    }
    return neighbors;
  }

  private heuristic(a: Node, b: Node): number {
    // const dx = Math.abs(a.position.x - b.position.x);
    // const dy = Math.abs(a.position.y - b.position.y);
    // if (this.diagonals) {
    //   // Euclidean distance
    //   return Math.sqrt(dx * dx + dy * dy);
    // } else {
    //   // Manhattan distance
    //   return dx + dy;
    // }
    // return Math.sqrt(dx * dx + dy * dy);
    return (
      Math.abs(a.position.x - b.position.x) +
      Math.abs(a.position.y - b.position.y)
    );
  }

  findPath(startPos: Position, targetPos: Position): Node[] {
    const startNode = this.grid[startPos.y][startPos.x];
    const targetNode = this.grid[targetPos.y][targetPos.x];

    const openSet: Node[] = [];
    const closedSet: Set<Node> = new Set();
    startNode.cost = 0;
    startNode.total = this.heuristic(startNode, targetNode);
    openSet.push(startNode);

    while (openSet.length > 0) {
      // Find the node with the lowest total score
      openSet.sort((a, b) => a.total - b.total);
      const currentNode = openSet.shift()!;

      // Path has been found
      if (currentNode === targetNode) {
        const path: Node[] = [];
        let current: Node | null = currentNode;
        while (current) {
          path.unshift(current);
          current = current.parent;
        }
        return path;
      }

      closedSet.add(currentNode);

      // Explore neighbors
      for (const neighbor of this.getNeighbors(currentNode)) {
        if (closedSet.has(neighbor)) continue;

        const directionToNeighbor = {
          x: neighbor.position.x - currentNode.position.x,
          y: neighbor.position.y - currentNode.position.y,
        };

        const tentativeCost = currentNode.cost + (neighbor.moveCost || 1);

        if (!openSet.includes(neighbor)) openSet.push(neighbor);
        else if (tentativeCost >= neighbor.cost) continue;

        neighbor.setParent(currentNode, directionToNeighbor); // Update parent and direction
        neighbor.cost = tentativeCost;
        neighbor.total = neighbor.cost + this.heuristic(neighbor, targetNode);
      }
    }

    // No path found
    return [];
  }
}
