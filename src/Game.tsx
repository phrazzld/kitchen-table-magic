import React, { SetStateAction } from "react";
import "./App.css";
import { useParams } from "react-router-dom";
import { getDecks, IRawDeckData } from "./DeckEditor";
import { getDeck, ICardData } from "./DeckViewer";
import Table from "./Table";
import { newCardData } from "./Card";
import Deck from "./Deck";

// material ui
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";

interface IDeckLoader {
  setDeckId: React.Dispatch<SetStateAction<string>>;
}

const DeckLoader = (props: IDeckLoader) => {
  const [decks, setDecks] = React.useState<IRawDeckData[]>([]);
  const [chosenDeck, setChosenDeck] = React.useState<string>("");

  React.useEffect(() => {
    const asyncDeckFetch = async () => {
      setDecks(await getDecks());
    };
    asyncDeckFetch();
  }, []);

  const handleDeckSelection = (event: any): void => {
    setChosenDeck(event.target.value);
    props.setDeckId(event.target.value);
  };

  return (
    <div className="DeckLoader">
      <FormControl>
        <InputLabel id="deckLoaderLabel">Choose your deck</InputLabel>
        <Select
          labelId="deckLoaderLabel"
          id="deckLoaderSelect"
          value={chosenDeck}
          onChange={handleDeckSelection}
          style={{ width: "10rem" }}
        >
          {decks.map((deck) => {
            return (
              <MenuItem key={deck._id} value={deck._id}>
                {deck.name}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </div>
  );
};

interface IGame {
  users: string[];
  shareDeck: (deck: Deck) => void,
  enemyDecks: Deck[];
}

const Game = (props: IGame) => {
  const [deckId, setDeckId] = React.useState<string>("");
  const [deck, setDeck] = React.useState<Deck>([]);
  const [filteredDecks, setFilteredDecks] = React.useState<Deck[]>([]);

  React.useEffect(() => {
    const fetchDeckData = async () => {
      if (deckId) {
        const fetchedDeck = await getDeck(deckId);
        const formattedDeck = fetchedDeck.cards.map((card: ICardData) =>
          newCardData(card.name, card.png)
        );
        setDeck(formattedDeck);
        props.shareDeck(formattedDeck);

      }
    };
    fetchDeckData();
  }, [deckId]);

  React.useEffect(() => {
    setFilteredDecks(props.enemyDecks.filter((enemyDeck) => enemyDeck != deck));
  }, [props.enemyDecks]);

  const { lobbyId } = useParams();
  return (
    <div className="Game">
      <p>Game Lobby ID: {lobbyId}</p>
      {props.users.map((user) => (
        <p key={user}>{user}</p>
      ))}
      <DeckLoader setDeckId={setDeckId} />
      <Table decks={[deck]} />
      { filteredDecks ? <Table decks={filteredDecks}/> : <p> No Other Users </p>}

    </div>
  );
};

export default Game;
