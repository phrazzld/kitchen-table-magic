import React from "react";
import Board from "./Board";
import Login from "./Login";
import Lobby from "./Lobby";
import DeckViewer from "./DeckViewer"
import DeckEditor from "./DeckEditor";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

function App() {
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
          <Board />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
