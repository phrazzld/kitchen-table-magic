import axios from "axios";
import _ from "lodash";
import React from "react";
import styled from "styled-components";
import { generateId } from "./utils";

// TODO: get Card to look up the image if it's not passed as a prop

export type Zone = "BATTLEFIELD" | "GRAVEYARD" | "EXILE" | "LIBRARY" | "HAND";

export type CardData = {
  id: string;
  name: string;
  image: string
  zone: Zone;
};

export const newCardData = (name: string, image: string): CardData => {
  return {
    id: generateId(),
    name,
    image,
    zone: "LIBRARY"
  };
};

const getCardImage = (cardDataBlob: any): string => {
  if (cardDataBlob.card_faces) {
    return cardDataBlob.card_faces[0].image_uris.png;
  } else if (cardDataBlob.image_uris) {
    return cardDataBlob.image_uris.png;
  } else {
    throw new Error("No card_faces or image_uris found for cardDataBlob");
  }
};

const CardImage = styled.img`
  height: 20rem;
  margin: 0.5rem;
`;

interface ICard {
  name: string;
  image: string;
  click: (event: any) => void;
  style?: any;
}

const Card = (props: ICard) => {

  return (
    <CardImage
      src={props.image}
      alt={props.name}
      style={props.style}
      onClick={props.click}
    />
  )
};

export default Card;
