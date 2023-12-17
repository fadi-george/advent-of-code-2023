declare global {
  interface Array<T> {
    sum(this: Array<number>): number;
    product(this: Array<number>): number;
    repeat(this: Array<any>, n: number): Array<number>;
  }
}
export {};
