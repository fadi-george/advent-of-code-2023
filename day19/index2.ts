// https://adventofcode.com/2023/day/19

let [lines1, lines2] = require("fs")
  .readFileSync("./IO/19v.txt", "utf8")
  .split(/\r?\n\r?\n/)
  .map((e) => e.split(/\r?\n/));

const p1 = () => {
  let db = {};
  lines1.map(
    (e) => (
      (a = e.split("{")),
      (db[a[0]] = a[1]
        .slice(0, -1)
        .replaceAll(/([a-zA-Z]+)(?![<>])/g, "'$&'")
        .replaceAll(/(\w)[<>]/g, "dd.$&")
        .replaceAll(":", "?")
        .replaceAll(",", ":"))
    )
  );
  let data = [];
  lines2.map((e, i) => {
    data[i] = {};
    e.slice(1, -1)
      .split(",")
      .map((str) => {
        let a = str.split("=");
        data[i][a[0]] = +a[1];
      });
  });

  return data
    .map((dd) => {
      let bu = eval(db.in);
      while (bu != "A" && bu != "R") {
        bu = eval(db[bu]);
      }
      return bu == "A" ? Object.values(dd).reduce((a, b) => a + b) : 0;
    })
    .reduce((a, b) => a + b);
};

const p2 = () => {
  let db = {};
  lines1.map((e) => ((a = e.split("{")), (db[a[0]] = a[1].slice(0, -1))));
  let possib = [];

  function getConditions(
    str,
    pool = { x: [1, 4000], m: [1, 4000], a: [1, 4000], s: [1, 4000] }
  ) {
    if (!pool) return;
    if (!str.includes(",")) {
      if (str[0] == "A") return possib.push(JSON.parse(JSON.stringify(pool)));
      if (str[0] == "R") return;
      getConditions(db[str], pool);
    } else {
      const indColon = str.indexOf(":");
      let [beforeColon, afterColon] = [
        str.slice(0, indColon),
        str.slice(indColon + 1),
      ];
      const indComma = afterColon.indexOf(",");
      let [beforeComma, afterComma] = [
        afterColon.slice(0, indComma),
        afterColon.slice(indComma + 1),
      ];
      //  beforeColon(c) ? beforeComma : afterComma
      getConditions(beforeComma, tweak(pool, beforeColon));
      getConditions(afterComma, tweak(pool, beforeColon, true));
    }
  }
  function tweak(pool, cond, rev = false) {
    // x>2662
    const clone = JSON.parse(JSON.stringify(pool));
    let interval = clone[cond[0]];
    if (!interval) return;
    if (rev) {
      if (cond[1] == ">") interval[1] = Math.min(interval[1], +cond.slice(2));
      if (cond[1] == "<") interval[0] = Math.max(interval[0], +cond.slice(2));
    } else {
      if (cond[1] == ">")
        interval[0] = Math.max(interval[0], +cond.slice(2) + 1);
      if (cond[1] == "<")
        interval[1] = Math.min(interval[1], +cond.slice(2) - 1);
    }
    if (interval[0] > interval[1]) interval = null;
    clone[cond[0]] = interval;
    return clone;
  }

  getConditions(db.in);
  return possib
    .map(
      (e) =>
        (e.x[1] - e.x[0] + 1) *
        (e.m[1] - e.m[0] + 1) *
        (e.a[1] - e.a[0] + 1) *
        (e.s[1] - e.s[0] + 1)
    )
    .reduce((a, b) => a + b);
};

console.log("p1:", p1(), "(383682)");
console.log("p2:", p2(), "(117954800808317)");
