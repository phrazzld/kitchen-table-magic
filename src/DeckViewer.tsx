import React from "react";
import { useParams } from "react-router-dom";

interface ICard {
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
};

const DeckViewer = () => {
  const [deckName, setDeckName] = React.useState<string>();
  const [cards, setCards] = React.useState<ICard[]>([]);

  const { deckId } = useParams();

  React.useEffect(() => {
    const getDeckData = async () => {
      if (deckId) {
        const deckData = await getDeck(deckId);
        if (deckData && deckData.name && deckData.cards) {
          setDeckName(deckData.name);
          setCards(deckData.cards);
        }
      }
    };
    getDeckData();
  }, []);

  return (
    <div className="deckViewer">
      <h2>{deckName}</h2>
      {cards.map((card) => (
        <img
          src={card.png}
          alt={card.name}
          style={{
            height: "20em",
          }}
        />
      ))}
    </div>
  );
};

export default DeckViewer;
