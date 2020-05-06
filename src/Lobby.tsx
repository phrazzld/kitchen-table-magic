import React from "react";
import "./App.css";
import Game from "./Game";
import Table from "./Table";
import Deck from "./Deck";
import { useParams, Redirect } from "react-router-dom";
import io from "socket.io-client";

interface ILobby {
  loggedIn: boolean;
  email: string
}

interface IEnemyDeckAssigned {
  email: string,
  deck: Deck
}

const Lobby = (props: ILobby) => {giut 
  const [users, setUsers] = React.useState<string[]>([]);
  const [socket] = React.useState(() => io("/"));
  const { lobbyId } = useParams();

  const [enemyDecks, setEnemyDecks] = React.useState<Deck[]>([]);

  React.useEffect(() => {
    if (props.loggedIn && props.email) {
      console.log(props.email)
      socket.emit("join", lobbyId, props.email);

      socket.on("usersConnected", (userEmails: string[], decks: IEnemyDeckAssigned[]) => {
        setUsers(userEmails);
        decks = decks.filter((deck) => deck.email != props.email && deck.deck);
        const typedDecks: Deck[] = decks.map((deck) => deck.deck);
        setEnemyDecks(typedDecks);
      });


      socket.on("refreshDecks", (decks: IEnemyDeckAssigned[]) => {
        decks = decks.filter((deck) => deck.email != props.email && deck.deck);
        const typedDecks: Deck[] = decks.map((deck) => deck.deck);
        setEnemyDecks(typedDecks);
      });

    }
  }, [props.loggedIn, props.email]);

  const shareDeck = (deck: Deck): void => {
    socket.emit("shareDeck", lobbyId, deck);
  }

  return (
    <div className="lobby">
      {props.loggedIn ? <Game users={users} shareDeck={shareDeck} enemyDecks={enemyDecks}/> : <Redirect to="/" />}
    </div>
  );
};

export default Lobby;
