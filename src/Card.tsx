import React from "react";
import axios from "axios";
import styled from "styled-components";
import _ from "lodash";
import { generateId } from "./utils";

export type Zone = "BATTLEFIELD" | "GRAVEYARD" | "EXILE" | "LIBRARY" | "HAND";

export type CardData = {
  id: string;
  name: string;
  zone: Zone;
};

export const newCardData = (name: string): CardData => {
  return {
    id: generateId(),
    name: name,
    zone: "LIBRARY"
  };
};

const getCardImage = (cardDataBlob: any) => {
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
  click: (event: any) => void;
  style?: any;
}

const Card = (props: ICard) => {
  const [cardData, setCardData] = React.useState();

  React.useEffect(() => {
    const goSetCardData = async (name: string): Promise<void> => {
      const res = await axios.get(
        `https://api.scryfall.com/cards/named?exact=${name}`
      );
      setCardData(res.data);
    };

    const debounced = _.debounce(goSetCardData.bind(props.name), 1100, {
      leading: true
    });
    debounced(props.name);
  }, [props.name]);

  if (cardData) {
    return (
      <CardImage
        src={getCardImage(cardData)}
        alt={`${cardData.name}: ${cardData.type_line}`}
        style={props.style}
        onClick={props.click}
      />
    );
  }

  return <p>Loading {props.name}</p>;
};

export default Card;
