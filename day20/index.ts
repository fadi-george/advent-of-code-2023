import { printGrid, readInput } from "../helpers";

const dir = import.meta.dir;

type State = "on" | "off";
type Pulse = "high" | "low";

type FlipFlop = {
  type: "%";
  name: string;
  dest: string[];
  state: State;
};
type Conjunction = {
  type: "&";
  name: string;
  dest: string[];
  pulses: Record<string, Pulse>;
};
type Module = FlipFlop | Conjunction;

const configs: Record<string, Module> = {};
let broadcaster: string[] = [];

const lines = readInput(dir);
lines.forEach((line) => {
  const [name, _dest] = line.split(" -> ");
  const dest = _dest.split(", ");

  if (name === "broadcaster") {
    broadcaster = dest;
  } else {
    const type = name[0] as "%" | "&";
    const id = name.slice(1);
    if (type === "%") configs[id] = { type, name: id, dest, state: "off" };
    else configs[id] = { type, name: id, dest, pulses: {} };
  }
});

const isFlipFlop = (m: Module): m is FlipFlop => m.type === "%";
const isConjunction = (m: Module): m is Conjunction => m.type === "&";

// set conjunction src inputs to low
Object.values(configs).forEach((m) => {
  m.dest.forEach((d) => {
    const module = configs[d];
    if (module && isConjunction(module)) module.pulses[m.name] = "low";
  });
});

const counts = { low: 0, high: 0 };
let cycle = 0;

const pushButton = () => {
  counts.low++;
  const q: { name: string; pulse: Pulse; src: string }[] = [];
  broadcaster.forEach((e) => {
    const module = configs[e];
    q.push({
      pulse: "low",
      name: module.name,
      src: "broadcaster",
    });
    counts.low++;
  });

  while (q.length) {
    const { name, pulse, src } = q.shift()!;
    const module = configs[name];

    // e.g. a module like 'output' that only is a destination
    if (!module) continue;

    if (isFlipFlop(module)) {
      if (pulse === "low") {
        // toggle state
        module.state = module.state === "on" ? "off" : "on";
        const nextPulse = module.state === "on" ? "high" : "low";
        module.dest.forEach((d) => {
          q.push({
            name: d,
            pulse: nextPulse,
            src: module.name,
          });
          counts[nextPulse]++;
        });
      }

      // conjunction
    } else {
      module.pulses[src] = pulse;
      const isHigh = Object.values(module.pulses).every((p) => p === "high");
      const nextPulse = isHigh ? "low" : "high";
      module.dest.forEach((d) => {
        q.push({
          name: d,
          pulse: nextPulse,
          src: module.name,
        });
        counts[nextPulse]++;
      });
    }
  }
};

const areFlipFlopsOff = () =>
  Object.values(configs)
    .filter(isFlipFlop)
    .every((m) => m.state === "off");

do {
  pushButton();
  console.log("\n");
  cycle++;
  if (cycle === 1000) break;
} while (!areFlipFlopsOff());

// push buttons 1000 times
let repeats = Math.floor(1000 / cycle);
let i = repeats * cycle;

counts.low *= repeats;
counts.high *= repeats;

while (i < 1000) {
  pushButton();
  i++;
}

const p1 = counts.high * counts.low;
console.log("Part 1: ", p1);
