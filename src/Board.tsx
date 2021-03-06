import Button from "@material-ui/core/Button";
import React from "react";
import OutsideClickHandler from "react-outside-click-handler";
import Card, { Zone, CardData } from "./Card";
import Deck, { shuffleDeck } from "./Deck";

type Coordinates = {
  top: number;
  left: number;
};

type ActiveCardMenu = {
  card: CardData;
  coordinates: Coordinates;
};

interface ICardActionMenuButton {
  text: string;
  onClick: () => void;
}

const CardActionMenuButton = (props: ICardActionMenuButton) => {
  return (
    <Button
      variant="contained"
      color="primary"
      onClick={props.onClick}
      style={{ margin: "0.3em" }}
    >
      {props.text}
    </Button>
  );
};

interface IBoard {
  deck: Deck;
}

const Board = (props: IBoard) => {
  const [cards, setCards] = React.useState<Deck>(props.deck);
  const [
    activeCardMenu,
    setActiveCardMenu
  ] = React.useState<ActiveCardMenu | null>(null);
  const [showLibraryMenu, setShowLibraryMenu] = React.useState<boolean>(false);
  const [showOverlay, setShowOverlay] = React.useState<boolean>(false);
  const [overlayCardName, setOverlayCardName] = React.useState<string>("");
  const [overlayCardImageURL, setOverlayCardImageURL] = React.useState<string>("");

  const getCardsForZone = (zone: Zone): Array<CardData> => {
    return cards.filter((card: CardData) => card.zone === zone);
  };

  const moveCardsToZone = (cardIds: Array<string>, zone: Zone): void => {
    const updatedCards = cards.map((card: CardData) => {
      if (cardIds.indexOf(card.id) > -1) {
        return { ...card, zone: zone };
      } else {
        return card;
      }
    });
    setCards(updatedCards);
  };

  const moveCardToZone = (cardId: string, zone: Zone): void => {
    moveCardsToZone([cardId], zone);
  };

  const handleClick = (event: any, card: CardData): void => {
    const docElem = document.documentElement;
    const docBod = document.body;
    const scrollTop = (docElem && docElem.scrollTop) || docBod.scrollTop;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = bounds.x;
    const y = bounds.y;
    // show actions for that card
    setActiveCardMenu({
      card: card,
      coordinates: {
        top: y + scrollTop,
        left: x
      }
    });
  };

  const getZones = (): Array<Zone> => {
    const zones: Array<Zone> = [
      "BATTLEFIELD",
      "LIBRARY",
      "HAND",
      "GRAVEYARD",
      "EXILE"
    ];
    return zones;
  };

  interface ICardMenu {
    cardId: string;
    cardImage: string;
    cardName: string;
    coordinates: Coordinates;
  }

  const handleLibraryClick = (): void => {
    setShowLibraryMenu(showLibraryMenu => !showLibraryMenu);
  };

  const draw = (n: number): void => {
    let cardIds: Array<string> = [];
    for (let i = 0; i < n; i++) {
      if (getCardsForZone("LIBRARY")[i]) {
        cardIds.push(getCardsForZone("LIBRARY")[i].id);
      } else {
        window.alert("You drew too many cards. You lose!");
      }
    }
    moveCardsToZone(cardIds, "HAND");
  };

  const handleShuffleClick = (): void => {
    const shuffledLibrary: Array<CardData> = shuffleDeck(
      getCardsForZone("LIBRARY")
    );
    let i = -1;
    setCards((cards: Array<CardData>) => {
      return cards.map((card: CardData) => {
        if (card.zone === "LIBRARY") {
          i++;
          return shuffledLibrary[i];
        } else {
          return card;
        }
      });
    });
  };

  const LibraryMenu = () => {
    return (
      <div className="library-menu">
        <div className="library-menu-action">
          <CardActionMenuButton
            text="Draw"
            onClick={() => {
              draw(1);
              setShowLibraryMenu(false);
            }}
          />
        </div>
        <div className="library-menu-action">
          <CardActionMenuButton
            text="Draw Seven"
            onClick={() => {
              draw(7);
              setShowLibraryMenu(false);
            }}
          />
        </div>
        <div className="library-menu-action">
          <CardActionMenuButton
            text="Search"
            onClick={() => console.log("Search")}
          />
        </div>
        <div className="library-menu-action">
          <CardActionMenuButton text="Shuffle" onClick={handleShuffleClick} />
        </div>
        <div className="library-menu-action">
          <CardActionMenuButton
            text="Reveal Top Card"
            onClick={() => console.log("Reveal Top Card")}
          />
        </div>
      </div>
    );
  };

  interface IOverlay {
    cardName: string;
    cardImageURL: string
  }

  const Overlay = (props: IOverlay) => {
    return (
      <div
        style={{
          position: "absolute",
          height: "100%",
          width: "100%",
          backgroundColor: "gray"
        }}
      >
        <h3
          className="close-overlay"
          onClick={() => setShowOverlay(false)}
          style={{ textAlign: "right" }}
        >
          X
        </h3>
        <Card
          name={props.cardName}
          image={props.cardImageURL}
          click={() => {
            setOverlayCardName("");
            setOverlayCardImageURL("");
            setShowOverlay(false);
          }}
          style={{ height: "30em" }}
        />
      </div>
    );
  };

  const lookCloser = (cardName: string, cardImageURL: string) => {
    setOverlayCardName(cardName);
    setOverlayCardImageURL(cardImageURL)
    setShowOverlay(true);
  };

  const CardMenu = (props: ICardMenu) => {
    return (
      <div
        className="card-menu"
        style={{
          position: "absolute",
          top: `${props.coordinates.top + 25}px`,
          left: `${props.coordinates.left}px`,
          border: "1px solid black",
          margin: "0.5em"
        }}
      >
        {getZones().map((zone: Zone) => {
          return (
            <div key={`${props.cardId}_to_${zone.toString()}`}>
              <CardActionMenuButton
                text={`Send to ${zone.toString()}`}
                onClick={() => {
                  moveCardToZone(props.cardId, zone);
                  setActiveCardMenu(null);
                }}
              />
            </div>
          );
        })}
        <div>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              lookCloser(props.cardName, props.cardImage);
              setActiveCardMenu(null);
            }}
          >
            Look Closer
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {showOverlay && <Overlay cardName={overlayCardName} cardImageURL={overlayCardImageURL} />}
      {activeCardMenu && (
        <OutsideClickHandler
          onOutsideClick={() => {
            console.log("outside click handler triggered");
            setActiveCardMenu(null);
            setShowLibraryMenu(false);
          }}
        >
          <CardMenu
            cardId={activeCardMenu.card.id}
            cardName={activeCardMenu.card.name}
            cardImage={activeCardMenu.card.image}
            coordinates={activeCardMenu.coordinates}
          />
        </OutsideClickHandler>
      )}
      <div className="battlefield">
        <h4>Battlefield</h4>
        {cards
          .filter((card: CardData) => card.zone === "BATTLEFIELD")
          .map((card: CardData) => (
            <Card
              key={card.id}
              name={card.name}
              image={card.image}
              click={event => handleClick(event, card)}
            />
          ))}
      </div>
      <div className="piles" style={{ display: "flex", flexDirection: "row" }}>
        <div
          className="library"
          style={{
            flex: 1,
            border: "2px solid brown",
            margin: "0.5em",
            padding: "0.5em"
          }}
          onClick={handleLibraryClick}
        >
          <h4>Library</h4>
          <h2>{getCardsForZone("LIBRARY").length}</h2>
          {showLibraryMenu && (
            <OutsideClickHandler
              onOutsideClick={() => {
                setShowLibraryMenu(false);
              }}
            >
              <LibraryMenu />
            </OutsideClickHandler>
          )}
        </div>
        <div
          className="graveyard"
          style={{
            flex: 1,
            border: "2px solid brown",
            margin: "0.5em",
            padding: "0.5em"
          }}
        >
          <h4>Graveyard</h4>
          {getCardsForZone("GRAVEYARD")[0] && (
            <Card
              name={getCardsForZone("GRAVEYARD")[0].name}
              image={getCardsForZone("GRAVEYARD")[0].image}
              click={event =>
                handleClick(event, getCardsForZone("GRAVEYARD")[0])
              }
            />
          )}
        </div>
        <div
          className="exile"
          style={{
            flex: 1,
            border: "2px solid brown",
            margin: "0.5em",
            padding: "0.5em"
          }}
        >
          <h4>Exile</h4>
          {getCardsForZone("EXILE")[0] && (
            <Card
              name={getCardsForZone("EXILE")[0].name}
              image={getCardsForZone("EXILE")[0].image}
              click={event => handleClick(event, getCardsForZone("EXILE")[0])}
            />
          )}
        </div>
      </div>
      <div className="hand">
        <h4>Hand</h4>
        {getCardsForZone("HAND").map(card => (
          <Card
            key={card.id}
            name={card.name}
            image={card.image}
            click={event => handleClick(event, card)}
          />
        ))}
      </div>
    </div>
  );
};

export default Board;
