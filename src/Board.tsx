import React from "react";
import Card from "./Card";

interface IBattlefield {
  cards: Array<string>;
}

const Battlefield = (props: IBattlefield) => {
  return (
    <div>
      {props.cards.map(card => (
        <Card name={card} />
      ))}
    </div>
  );
};

interface IPile {
  name: string;
  cards: Array<string>;
}

const Pile = (props: IPile) => {
  console.log("Pile::props.name:", props.name);
  console.log("Pile::props.cards:", props.cards);

  return (
    <div style={{ border: "1px solid brown" }}>
      <h4>{props.name}</h4>
    </div>
  );
};

interface IHand {
  cards: Array<string>;
}

const Hand = (props: IHand) => {
  return (
    <div>
      {props.cards.map(card => (
        <Card name={card} />
      ))}
    </div>
  );
};

interface IBoard {}

const Board = (props: IBoard) => {
  const mockBattlefield = [
    "Phage the Untouchable",
    "Necropotence",
    "Mana Crypt",
    "Swamp",
    "Ancient Tomb",
    "Phyrexian Tower"
  ];

  const mockLibrary: string[] = [];
  const mockGraveyard: string[] = [];
  const mockExile: string[] = [];

  const mockHand = [
    "Yawgmoth's Will",
    "Dark Ritual",
    "Exsanguinate",
    "Damnation"
  ];

  return (
    <div>
      <Battlefield cards={mockBattlefield} />
      <Pile name="Library" cards={mockLibrary} />
      <Pile name="Graveyard" cards={mockGraveyard} />
      <Pile name="Exile" cards={mockExile} />
      <Hand cards={mockHand} />
    </div>
  );
};

export default Board;
