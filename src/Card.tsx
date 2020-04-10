import React from "react";
import axios from "axios";

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
    };

    goSetCardData(props.name);
  }, [props.name]);

  if (cardData) {
    return (
      <img
        src={cardData.image_uris.png}
        alt={`${cardData.name}: ${cardData.type_line}`}
        style={{
          height: "25em"
        }}
      />
    );
  }

  return <p>Loading {props.name}</p>;
};

export default Card;
