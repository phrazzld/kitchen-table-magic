const axios = require("axios");

const fetchCard = async (cardName) => {
  const url = `https://api.scryfall.com/cards/named?exact=${encodeURI(cardName)}`;
  const cardData = await axios.get(url);
  let png;
  if(cardData.data.card_faces) {
    png = cardData.data.card_faces[0].image_uris.png;
  } else if(cardData.data.image_uris){
    png = cardData.data.image_uris.png;
  } else {
    throw new Error("No images found");
  }
  return {
    name: cardData.data.name,
    png
  };
};

module.exports = {
  fetch: fetchCard,
};
