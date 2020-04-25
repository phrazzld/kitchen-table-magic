import { shuffle } from "./utils";
import { CardData } from "./Card";

type Deck = Array<CardData>;

// Deck ain't been shuffled till it's been shuffled seven times
export const shuffleDeck = (deck: Deck): Deck => {
  for (let i: number = 0; i < 7; i++) {
    deck = shuffle(deck);
  }

  return deck;
};

export default Deck;
