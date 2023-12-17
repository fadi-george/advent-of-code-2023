type PriorityQueueItem<T> = {
  value: T;
  priority: number;
};

export class PriorityQueue<T> {
  private heap: PriorityQueueItem<T>[];

  constructor() {
    this.heap = [];
  }

  private getParentIndex(i: number): number {
    return Math.floor((i - 1) / 2);
  }

  private getLeftChildIndex(i: number): number {
    return 2 * i + 1;
  }

  private getRightChildIndex(i: number): number {
    return 2 * i + 2;
  }

  private hasParent(i: number): boolean {
    return this.getParentIndex(i) >= 0;
  }

  private hasLeftChild(i: number): boolean {
    return this.getLeftChildIndex(i) < this.heap.length;
  }

  private hasRightChild(i: number): boolean {
    return this.getRightChildIndex(i) < this.heap.length;
  }

  private swap(i1: number, i2: number): void {
    [this.heap[i1], this.heap[i2]] = [this.heap[i2], this.heap[i1]];
  }

  private heapifyUp(): void {
    let index = this.heap.length - 1;
    while (
      this.hasParent(index) &&
      this.heap[this.getParentIndex(index)].priority > this.heap[index].priority
    ) {
      this.swap(this.getParentIndex(index), index);
      index = this.getParentIndex(index);
    }
  }

  private heapifyDown(): void {
    let index = 0;
    while (this.hasLeftChild(index)) {
      let smallerChildIndex = this.getLeftChildIndex(index);
      if (
        this.hasRightChild(index) &&
        this.heap[this.getRightChildIndex(index)].priority <
          this.heap[smallerChildIndex].priority
      ) {
        smallerChildIndex = this.getRightChildIndex(index);
      }

      if (this.heap[index].priority < this.heap[smallerChildIndex].priority) {
        break;
      } else {
        this.swap(index, smallerChildIndex);
      }
      index = smallerChildIndex;
    }
  }

  public enqueue(value: T, priority: number): void {
    this.heap.push({ value, priority });
    this.heapifyUp();
  }

  public dequeue(): T | null {
    if (this.heap.length === 0) return null;
    if (this.heap.length === 1) return this.heap.pop()!.value;

    const item = this.heap[0].value;
    this.heap[0] = this.heap.pop()!;
    this.heapifyDown();
    return item;
  }

  public peek(): T | null {
    if (this.heap.length === 0) return null;
    return this.heap[0].value;
  }

  public isEmpty(): boolean {
    return this.heap.length === 0;
  }
}
