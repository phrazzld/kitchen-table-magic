import React from "react";
import Login, { getCurrentUser } from "./Login";
import Lobby from "./Lobby";
import DeckViewer from "./DeckViewer";
import DeckEditor from "./DeckEditor";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Table from "./Table";
import { getDeck } from "./DeckViewer";

const App = () => {
  const [loggedIn, setLoggedIn] = React.useState<boolean>(true);
  const [userEmail, setUserEmail] = React.useState<string>("")
  const [deck, setDeck] = React.useState();

  React.useEffect(() => {
    const asyncLogin = async () => {
      const loggedIn = await getCurrentUser();
      setLoggedIn(loggedIn.loggedIn);
      setUserEmail(loggedIn.email);
    };
    asyncLogin();
  }, []);

  return (
    <Router>
      <Switch>
        <Route path="/game/:lobbyId">
          <Lobby loggedIn={loggedIn} email={userEmail}/>
        </Route>
        <Route path="/decks/:deckId">
          <DeckViewer loggedIn={loggedIn} />
        </Route>
        <Route path="/decks">
          <DeckEditor loggedIn={loggedIn} />
        </Route>
        <Route path="/">
          <Login
            loggedIn={loggedIn}
            userEmail={userEmail}
            setUserEmail={setUserEmail}
            setLoggedIn={setLoggedIn}
          />

        </Route>
      </Switch>
    </Router>
  );
};

export default App;
