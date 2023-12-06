declare global {
  interface Array<T> {
    sum(this: Array<number>): number;
    product(this: Array<number>): number;
  }
}
export {};
