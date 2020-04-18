import React from "react";
import Board from "./Board";
import Login from './Login';
import Lobby from './Lobby';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

function App() {
  return (
    <Router>
      <Switch>
        <Route path = '/game/:id' >
          <Lobby />
        </Route>
        <Route path = '/'>
          <Login />
          <Search />
          <Board />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
