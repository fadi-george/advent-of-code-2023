import { readInput } from "../helpers";

const dir = import.meta.dir;
const lines = readInput(dir, "\n");

let CardVal = {
  "2": 0,
  "3": 1,
  "4": 2,
  "5": 3,
  "6": 4,
  "7": 5,
  "8": 6,
  "9": 7,
  T: 8,
  J: 9,
  Q: 10,
  K: 11,
  A: 12,
};

enum CardType {
  High = 0,
  OnePair = 1,
  TwoPair = 2,
  ThreeOfAKind = 3,
  FullHouse = 3.5,
  FourOfAKind = 4,
  FiveOfAKind = 5,
}

let games: { bid: number; cards: string; type: CardType }[] = [];
lines.forEach((line) => {
  const [cards, bid] = line.split(" ");
  const cardCounts = cards
    .split("")
    .reduce<Record<string, number>>((acc, card) => {
      acc[card] = acc[card] ? acc[card] + 1 : 1;
      return acc;
    }, {});

  const len = Object.keys(cardCounts).length;
  const counts = Object.values(cardCounts);

  let type = CardType.High;
  if (len === 4 && counts.includes(2)) {
    type = CardType.OnePair;
  } else if (len === 3 && counts.includes(2)) {
    type = CardType.TwoPair;
  } else if (len === 3 && counts.includes(3)) {
    type = CardType.ThreeOfAKind;
  } else if (len === 2 && counts.includes(3)) {
    type = CardType.FullHouse;
  } else if (len === 2 && counts.includes(4)) {
    type = CardType.FourOfAKind;
  } else if (len === 1) {
    type = CardType.FiveOfAKind;
  }

  games.push({
    cards: cards,
    bid: +bid,
    type,
  });
});

games.sort((a, b) => {
  const aType = a.type;
  const bType = b.type;

  if (aType === bType) {
    const aCards = a.cards.split("");
    const bCards = b.cards.split("");

    for (let i = 0; i < aCards.length; i++) {
      const diff =
        CardVal[aCards[i] as keyof typeof CardVal] -
        CardVal[bCards[i] as keyof typeof CardVal];

      if (diff !== 0) {
        return diff;
      }
    }
  }
  return aType - bType;
});

const p1 = games.reduce((acc, game, i) => {
  return acc + (i + 1) * game.bid;
}, 0);
console.log(p1);

// part 2
CardVal = {
  J: 0,
  "2": 2,
  "3": 3,
  "4": 4,
  "5": 5,
  "6": 6,
  "7": 7,
  "8": 8,
  "9": 9,
  T: 10,
  Q: 11,
  K: 12,
  A: 13,
};
games = [];
lines.forEach((line) => {
  const [cards, bid] = line.split(" ");
  const cardCounts = cards
    .split("")
    .reduce<Record<string, number>>((acc, card) => {
      acc[card] = acc[card] ? acc[card] + 1 : 1;
      return acc;
    }, {});

  if ("J" in cardCounts) {
    const reserve = cardCounts["J"];
    delete cardCounts["J"];
    const modeCards = Object.entries(cardCounts)
      .filter(([, count]) => count > 0)
      .sort((a, b) => {
        const diff = b[1] - a[1];
        if (diff === 0) {
          return (
            CardVal[b[0] as keyof typeof CardVal] -
            CardVal[a[0] as keyof typeof CardVal]
          );
        }
        return diff;
      });

    if (modeCards.length > 0) {
      const cardKey = modeCards[0][0];
      cardCounts[cardKey] += reserve;
    } else if (reserve === 5) {
      cardCounts["A"] = 5;
    }
  }

  const len = Object.keys(cardCounts).length;
  const counts = Object.values(cardCounts);

  let type = CardType.High;
  if (len === 4 && counts.includes(2)) {
    type = CardType.OnePair;
  } else if (len === 3 && counts.includes(2)) {
    type = CardType.TwoPair;
  } else if (len === 3 && counts.includes(3)) {
    type = CardType.ThreeOfAKind;
  } else if (len === 2 && counts.includes(3)) {
    type = CardType.FullHouse;
  } else if (len === 2 && counts.includes(4)) {
    type = CardType.FourOfAKind;
  } else if (len === 1) {
    type = CardType.FiveOfAKind;
  }

  games.push({
    cards: cards,
    bid: +bid,
    type,
  });
});

games.sort((a, b) => {
  const aType = a.type;
  const bType = b.type;

  if (aType === bType) {
    const aCards = a.cards.split("");
    const bCards = b.cards.split("");
    for (let i = 0; i < aCards.length; i++) {
      const diff =
        CardVal[aCards[i] as keyof typeof CardVal] -
        CardVal[bCards[i] as keyof typeof CardVal];
      if (diff !== 0) {
        return diff;
      }
    }
  }
  return aType - bType;
});

// 253986478 wrong
const p2 = games.reduce((acc, game, i) => {
  return acc + (i + 1) * game.bid;
}, 0);
console.log(p2);
