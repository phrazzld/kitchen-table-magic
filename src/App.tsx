import React from "react";
import Board from "./Board";
import Login from "./Login";
import Lobby from "./Lobby";
import DeckViewer from "./DeckViewer"
import DeckEditor from "./DeckEditor";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
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

  return (
    <Router>
      <Switch>
        <Route path="/game/:lobbyId">
          <Lobby />
        </Route>
        <Route path="/decks/:deckId">
          <DeckViewer />
        </Route>
        <Route path="/decks">
          <DeckEditor />
        </Route>
        <Route path="/">
          <Login />
          <Table decks={decks} />
        </Route>
      </Switch>
    </Router>
  );
};

export default App;
