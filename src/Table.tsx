import React from "react";
import Board from "./Board";
import Deck from "./Deck";
import { generateId } from "./utils";

interface ITable {
  decks: Array<Deck>;
}

const Table = (props: ITable) => {
  return (
    <React.Fragment>
      {props.decks &&
        props.decks.map((deck: any) => (
          <Board key={generateId()} deck={deck} />
        ))}
    </React.Fragment>
  );
};

export default Table;
