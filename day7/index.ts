import { readInput } from "../helpers";

const dir = import.meta.dir;
const lines = readInput(dir, "\n");

const CardVal = {
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
  High,
  OnePair,
  TwoPair,
  ThreeOfAKind,
  FullHouse,
  FourOfAKind,
  FiveOfAKind,
}

const games: { bid: number; cards: string; type: CardType }[] = [];
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
