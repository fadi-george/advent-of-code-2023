import { printGrid, readInput } from "../helpers";

const dir = import.meta.dir;

type Rules = [string, string, number, string];
const workflows: Record<string, Rules[]> = {};
