declare global {
  interface Array<T> {
    sum(this: Array<number>): number;
  }
}
export {};
