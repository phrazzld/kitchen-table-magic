import React from "react";
import Table from "./Table";
import Deck from "./Deck";
import { newCardData } from "./Card";

const App = () => {
  const blackDeck: Deck = [
    newCardData("Swamp"),
    newCardData("Swamp"),
    newCardData("Swamp"),
    newCardData("Swamp"),
    newCardData("Swamp"),
    newCardData("Swamp"),
    newCardData("Swamp"),
    newCardData("Swamp"),
    newCardData("Swamp"),
    newCardData("Phage the Untouchable"),
    newCardData("Dark Ritual"),
    newCardData("Mox Diamond"),
    newCardData("Black Lotus"),
    newCardData("Damnation"),
    newCardData("Yawgmoth's Will")
  ];

  const blueDeck: Deck = [
    newCardData("Island"),
    newCardData("Island"),
    newCardData("Island"),
    newCardData("Island"),
    newCardData("Island"),
    newCardData("Island"),
    newCardData("Island"),
    newCardData("Island"),
    newCardData("Island"),
    newCardData("Force of Will"),
    newCardData("Ancestral Recall"),
    newCardData("Talrand, Sky Summoner"),
    newCardData("Counterspell"),
    newCardData("Vizzerdrix")
  ];

  const decks: Array<Deck> = [blackDeck, blueDeck];

  return <Table decks={decks} />;
};

export default App;
