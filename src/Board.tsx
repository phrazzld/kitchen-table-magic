import React from "react";
import Card from "./Card";

type Zone = "BATTLEFIELD" | "GRAVEYARD" | "EXILE" | "LIBRARY" | "HAND";

type CardData = {
  name: string;
  zone: Zone;
};

interface IBattlefield {
  cards: Array<string>;
}

const Battlefield = (props: IBattlefield) => {
  const handleClick = (): void => {
    console.log("Battlefield::handleClick");
  };

  return (
    <div>
      <h4>Battlefield</h4>
      {props.cards.map(card => (
        <Card name={card} click={handleClick} />
      ))}
    </div>
  );
};

interface IPile {
  name: string;
  cards: Array<string>;
  showTopCard: boolean;
}

const Pile = (props: IPile) => {
  const topCard = props.cards[props.cards.length - 1];
  const showTopCard = props.showTopCard && topCard;

  const handleClick = () => {
    console.log("Pile::handleClick");
  };

  return (
    <div
      style={{
        flex: 1,
        border: "1px solid brown",
        margin: "0.5em",
        padding: "0.5em"
      }}
    >
      <h4>{props.name}</h4>
      {showTopCard && <Card name={topCard} click={handleClick} />}
    </div>
  );
};

interface IHand {
  cards: Array<string>;
}

const Hand = (props: IHand) => {
  const handleClick = () => {
    console.log("Hand::handleClick");
  };

  return (
    <div>
      <h4>Hand</h4>
      {props.cards.map(card => (
        <Card name={card} click={handleClick} />
      ))}
    </div>
  );
};

interface IBoard {}

const Board = (props: IBoard) => {
  const [cards, setCards] = React.useState<Array<CardData>>([
    { name: "Phage the Untouchable", zone: "BATTLEFIELD" },
    { name: "Dark Ritual", zone: "HAND" },
    { name: "Underworld Dreams", zone: "BATTLEFIELD" },
    { name: "Swamp", zone: "GRAVEYARD" },
    { name: "Yawgmoth, Thran Physician", zone: "EXILE" },
    { name: "Mox Opal", zone: "LIBRARY" }
  ]);

  const getCardsForZone = (zone: Zone): Array<string> => {
    return cards
      .filter((card: CardData) => card.zone === zone)
      .map((card: CardData) => card.name);
  };

  const moveCardToZone = (name: string, zone: Zone): void => {
    const updatedCards = cards.map((card: CardData) => {
      if (card.name === name) {
        return { ...card, zone: zone };
      } else {
        return card;
      }
    });
    setCards(updatedCards);
  };

  const mockBattlefield: string[] = getCardsForZone("BATTLEFIELD");
  const mockLibrary: string[] = getCardsForZone("LIBRARY");
  const mockGraveyard: string[] = getCardsForZone("GRAVEYARD");
  const mockExile: string[] = getCardsForZone("EXILE");
  const mockHand: string[] = getCardsForZone("HAND");

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <Battlefield cards={mockBattlefield} />
      <div style={{ display: "flex", flexDirection: "row" }}>
        <Pile name="Library" cards={mockLibrary} showTopCard={false} />
        <Pile name="Graveyard" cards={mockGraveyard} showTopCard={true} />
        <Pile name="Exile" cards={mockExile} showTopCard={true} />
      </div>
      <Hand cards={mockHand} />
    </div>
  );
};

export default Board;
