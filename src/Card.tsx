import React from "react";
import axios from "axios";
import _ from "lodash";

const getCardImage = (cardDataBlob: any) => {
  if (cardDataBlob.card_faces) {
    return cardDataBlob.card_faces[0].image_uris.png;
  } else if (cardDataBlob.image_uris) {
    return cardDataBlob.image_uris.png;
  } else {
    throw new Error("No card_faces or image_uris found for cardDataBlob");
  }
};

interface ICard {
  name: string;
  click: () => void;
}

const Card = (props: ICard) => {
  const [cardData, setCardData] = React.useState();

  React.useEffect(() => {
    const goSetCardData = async (name: string): Promise<void> => {
      const res = await axios.get(
        `https://api.scryfall.com/cards/named?exact=${props.name}`
      );
      setCardData(res.data);
    };

    const debounced = _.debounce(goSetCardData.bind(props.name), 1100, {
      leading: true
    });
    debounced(props.name);
  }, [props.name]);

  const handleClick = (event: any) => {
    console.log("Card::handleClick:event:", event);
    console.log("cardData:", cardData);
    props.click();
  };

  if (cardData) {
    return (
      <img
        src={getCardImage(cardData)}
        alt={`${cardData.name}: ${cardData.type_line}`}
        style={{
          height: "20em"
        }}
        onClick={handleClick}
      />
    );
  }

  return <p>Loading {props.name}</p>;
};

export default Card;
