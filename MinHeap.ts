type HeapNode<T> = {
  value: number;
} & T;

export class MinHeap<T> {
  private heap: HeapNode<T>[];

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
      this.heap[this.getParentIndex(index)].value > this.heap[index].value
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
        this.heap[this.getRightChildIndex(index)].value <
          this.heap[smallerChildIndex].value
      ) {
        smallerChildIndex = this.getRightChildIndex(index);
      }

      if (this.heap[index].value < this.heap[smallerChildIndex].value) {
        break;
      } else {
        this.swap(index, smallerChildIndex);
      }
      index = smallerChildIndex;
    }
  }

  public add(element: HeapNode<T>): void {
    this.heap.push(element);
    this.heapifyUp();
  }

  public remove(): HeapNode<T> | null {
    if (this.heap.length === 0) return null;
    if (this.heap.length === 1) return this.heap.pop() ?? null;

    const item = this.heap[0];
    this.heap[0] = this.heap.pop()!;
    this.heapifyDown();
    return item;
  }

  public peek(): HeapNode<T> | null {
    if (this.heap.length === 0) return null;
    return this.heap[0];
  }

  public isEmpty(): boolean {
    return this.heap.length === 0;
  }

  get length() {
    return this.heap.length;
  }
}
