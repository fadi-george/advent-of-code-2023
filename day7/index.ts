import { readInput } from "../helpers";

const dir = import.meta.dir;
const lines = readInput(dir, "\n");

type Game = {
  bid: number;
  cards: string;
  type: CardType;
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
type CardKey = keyof typeof CardVal;

const getCardType = (cardCounts: Record<string, number>) => {
  const len = Object.keys(cardCounts).length;
  const counts = new Set(Object.values(cardCounts));

  switch (len) {
    case 4:
      if (counts.has(2)) return CardType.OnePair;
    case 3:
      if (counts.has(2)) return CardType.TwoPair;
      if (counts.has(3)) return CardType.ThreeOfAKind;
    case 2:
      if (counts.has(3)) return CardType.FullHouse;
      if (counts.has(4)) return CardType.FourOfAKind;
    case 1:
      return CardType.FiveOfAKind;
    default:
      return CardType.High;
  }
};

const getWinnings = (games: Game[]) => {
  const winnings = games.reduce((acc, game, i) => {
    return acc + (i + 1) * game.bid;
  }, 0);
  return winnings;
};

const sortGames = (games: Game[], cardVals: Record<string, number>) => {
  return games.sort((a, b) => {
    const aType = a.type;
    const bType = b.type;

    if (aType === bType) {
      const aCards = a.cards.split("");
      const bCards = b.cards.split("");
      for (let i = 0; i < aCards.length; i++) {
        const diff =
          cardVals[aCards[i] as CardKey] - cardVals[bCards[i] as CardKey];
        if (diff !== 0) {
          return diff;
        }
      }
    }
    return aType - bType;
  });
};

const parseLines = (line: string) => {
  const [cards, bid] = line.split(" ");
  const cardCounts = cards
    .split("")
    .reduce<Record<string, number>>((acc, card) => {
      acc[card] = acc[card] ? acc[card] + 1 : 1;
      return acc;
    }, {});

  return [cards, bid, cardCounts] as const;
};

// part 1
let games: Game[] = [];
lines.forEach((line) => {
  const [cards, bid, cardCounts] = parseLines(line);

  games.push({
    cards: cards,
    bid: +bid,
    type: getCardType(cardCounts),
  });
});

const p1 = getWinnings(sortGames(games, CardVal));
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
  const [cards, bid, cardCounts] = parseLines(line);

  if ("J" in cardCounts) {
    const reserve = cardCounts["J"];
    delete cardCounts["J"];
    const modeCards = Object.entries(cardCounts)
      .filter(([, count]) => count > 0)
      .sort((a, b) => {
        const diff = b[1] - a[1];

        // prefer higher value card when counts are equal
        if (diff === 0)
          return CardVal[b[0] as CardKey] - CardVal[a[0] as CardKey];

        return diff;
      });

    if (modeCards.length > 0) {
      const cardKey = modeCards[0][0];
      cardCounts[cardKey] += reserve;
    } else if (reserve === 5) {
      cardCounts["A"] = 5;
    }
  }

  games.push({
    cards: cards,
    bid: +bid,
    type: getCardType(cardCounts),
  });
});

const p2 = getWinnings(sortGames(games, CardVal));
console.log(p2);
