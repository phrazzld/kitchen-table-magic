import React from "react";
import Frame from "./Frame";

interface ICard {
  name: string;
}

const Card = (props: ICard) => {
  return (
    <Frame>
      <p>{props.name}</p>
    </Frame>
  );
};

export default Card;
