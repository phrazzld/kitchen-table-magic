import React from "react";
import "./App.css";
import { Redirect, Link } from "react-router-dom";

interface IDeckEditor {
  loggedIn: boolean
}

export interface IRawDeckData {
  cards: string[];
  _id: string;
  name: string;
}

export const getDecks = async () => {
  const response = await fetch("/api/decks");
  const json = await response.json();
  return json;
};

const DeckEditor = (props: IDeckEditor) => {
  const [deckInput, setDeckInput] = React.useState<string>("");
  const [deckNameInput, setDeckNameInput] = React.useState<string>("");
  const [deckStatusMessage, setDeckStatusMessage] = React.useState<string>("");
  const [allDecks, setAllDecks] = React.useState<IRawDeckData[]>([]);

  React.useEffect(()=>{
    const awaitDecks = async () => {
      const decks = await getDecks();
      if(decks) {
        setAllDecks(decks);
      }
    }
    awaitDecks();
  }, [])

  const handleDeckEditorChange = (event: any): void => {
    setDeckInput(event.target.value);
  };

  const handleDeckNameChange = (event: any): void => {
    setDeckNameInput(event.target.value);
  };

  const handleDeckSubmit = async () => {
    setDeckStatusMessage("");
    const deck = deckInput.split("\n");
    const formattedDeck = deck.map((card) => {
      const cardSections = card.split(" ");
      const cardQuantity = cardSections[0];
      cardSections.splice(0, 1);
      const cardName = cardSections.join(" ");
      return [cardQuantity, cardName];
    });

    setDeckStatusMessage("Saving Deck...");
    const response = await fetch("/api/decks", {
      method: "post",
      body: JSON.stringify({ cards: formattedDeck, name: deckNameInput }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    switch (response.status) {
      case 200:
        setDeckStatusMessage("Deck Successfully Added");
        setAllDecks(await getDecks());
        break;
      case 400:
        setDeckStatusMessage("You already have a deck with this name.");
        break;
      default:
        setDeckStatusMessage("Error fetching cards.");
        break;

    }
  };

  return (
    <>
      {props.loggedIn ? (
        <div>
          <div className="deckEditor">
            <div>
              <p> Deck Editor </p>
              <input
                type="text"
                name="deckNameInput"
                placeholder="Deck Name"
                value={deckNameInput}
                onChange={handleDeckNameChange}
              />
            </div>
            <textarea
              cols={75}
              rows={40}
              value={deckInput}
              onChange={handleDeckEditorChange}
            ></textarea>
            <button onClick={handleDeckSubmit}> Create Deck </button>
            <p>{deckStatusMessage}</p>
          </div>
          <div className="deckEditorList">
            <p>Decks:</p>
            <ul>
              {allDecks.map((deck) => (
                <li key={deck._id}>
                  <Link to={`/decks/${deck._id}`}> {deck.name} </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <Redirect to="/" />
      )}
    </>
  );
};

export default DeckEditor;
