import React from "react";
import axios from "axios";
import Frame from "./Frame";

interface ICard {
  name: string;
}

const Card = (props: ICard) => {
  const [cardData, setCardData] = React.useState();

  React.useEffect(() => {
    const goSetCardData = async (name: string): Promise<void> => {
      const res = await axios.get(
        `https://api.scryfall.com/cards/search?q=${props.name}`
      );
      setCardData(res.data.data[0]);
      console.log("cardData:", res);
    };

    goSetCardData(props.name);
  }, [props.name]);

  if (cardData) {
    return (
      <Frame>
        <h4>Name</h4>
        <p>Name: {cardData.name}</p>
        <p>Image: </p>
        <img
          src={cardData.image_uris.png}
          alt={`${cardData.name}: ${cardData.type_line}`}
        />
        <p>Type: {cardData.type_line}</p>
        <p>Oracle Text: {cardData.oracle_text}</p>
        <p>Power: {cardData.power}</p>
        <p>Toughness: {cardData.toughness}</p>
      </Frame>
    );
  }

  return (
    <Frame>
      <p>{props.name}</p>
    </Frame>
  );
};

export default Card;
