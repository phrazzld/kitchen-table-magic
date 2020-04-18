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
<<<<<<< HEAD
  return <Board />;
=======

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
>>>>>>> 041d97a71c8d483cff21d508fd4eb66ee2edde8a
}

export default App;
