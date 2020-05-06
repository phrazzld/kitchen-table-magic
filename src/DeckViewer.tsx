import React from "react";
import { useParams, Redirect } from "react-router-dom";
import {generateId} from "./utils"


export interface ICardData {
  _id: string;
  name: string;
  png: string;
}

export const getDeck = async (deckId: string) => {
  if (deckId) {
    const deckData = await fetch(`/api/decks/${deckId}`);
    const parsedData = await deckData.json();
    return parsedData;
  }
  throw new Error("No Deck ID");
};

interface IDeckViewer {
  loggedIn: boolean
}

const DeckViewer = (props: IDeckViewer) => {
  const [deckName, setDeckName] = React.useState<string>();
  const [cards, setCards] = React.useState<ICardData[]>([]);

  const { deckId } = useParams();

  React.useEffect(() => {
    const getDeckData = async () => {
      if (deckId) {
        let deckData;
        try {
          deckData = await getDeck(deckId);
        } catch (err) {
          return console.error(err);
        }
        if (deckData && deckData.name && deckData.cards) {
          setDeckName(deckData.name);
          setCards(deckData.cards);
        }
      }
    };
    getDeckData();
  }, []);

  return (
    <>
      { props.loggedIn ? (
        <div className="deckViewer">
          <h2>{deckName}</h2>
          {cards.map((card) => (
            <img
              src={card.png}
              alt={card.name}
              style={{
                height: "20rem",
              }}
              key={generateId()}
            />
          ))}
        </div>
      ) : (
        <Redirect to="/" />
      )}
    </>
  );
};

export default DeckViewer;
