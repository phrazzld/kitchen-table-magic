import React from "react";
import Button from "@material-ui/core/Button";
import OutsideClickHandler from "react-outside-click-handler";
import Card from "./Card";

type Zone = "BATTLEFIELD" | "GRAVEYARD" | "EXILE" | "LIBRARY" | "HAND";

type CardData = {
  id: string;
  name: string;
  zone: Zone;
};

const generateId = (): string => {
  return "_".concat(
    Math.random()
      .toString(36)
      .substr(2, 9)
  );
};

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

const Board = () => {
  const [cards, setCards] = React.useState<Array<CardData>>([
    { id: generateId(), name: "Phage the Untouchable", zone: "BATTLEFIELD" },
    { id: generateId(), name: "Dark Ritual", zone: "HAND" },
    { id: generateId(), name: "Underworld Dreams", zone: "BATTLEFIELD" },
    { id: generateId(), name: "Swamp", zone: "GRAVEYARD" },
    { id: generateId(), name: "Yawgmoth, Thran Physician", zone: "EXILE" },
    { id: generateId(), name: "Mox Opal", zone: "LIBRARY" },
    { id: generateId(), name: "Swamp", zone: "LIBRARY" },
    { id: generateId(), name: "Swamp", zone: "LIBRARY" }
  ]);
  const [
    activeCardMenu,
    setActiveCardMenu
  ] = React.useState<ActiveCardMenu | null>(null);
  const [showLibraryMenu, setShowLibraryMenu] = React.useState<boolean>(false);
  const [showOverlay, setShowOverlay] = React.useState<boolean>(false);
  const [overlayCard, setOverlayCard] = React.useState<string>("");

  const getCardsForZone = (zone: Zone): Array<CardData> => {
    return cards.filter((card: CardData) => card.zone === zone);
  };

  const moveCardToZone = (id: string, zone: Zone): void => {
    const updatedCards = cards.map((card: CardData) => {
      if (card.id === id) {
        return { ...card, zone: zone };
      } else {
        return card;
      }
    });
    setCards(updatedCards);
  };

  const mockBattlefield: Array<CardData> = getCardsForZone("BATTLEFIELD");
  const mockLibrary: Array<CardData> = getCardsForZone("LIBRARY");
  const mockGraveyard: Array<CardData> = getCardsForZone("GRAVEYARD");
  const mockExile: Array<CardData> = getCardsForZone("EXILE");
  const mockHand: Array<CardData> = getCardsForZone("HAND");

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
    cardName: string;
    coordinates: Coordinates;
  }

  const handleLibraryClick = (event: any): void => {
    console.log("handleLibraryClick::event:", event);
    setShowLibraryMenu(showLibraryMenu => !showLibraryMenu);
  };

  const LibraryMenu = () => {
    return (
      <div className="library-menu">
        <div className="library-menu-action">
          <CardActionMenuButton
            text="Draw"
            onClick={() => {
              moveCardToZone(mockLibrary[0].id, "HAND");
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
          <CardActionMenuButton
            text="Shuffle"
            onClick={() => console.log("Shuffle")}
          />
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
          click={() => {
            setOverlayCard("");
            setShowOverlay(false);
          }}
          style={{ height: "30em" }}
        />
      </div>
    );
  };

  const lookCloser = (cardName: string) => {
    setOverlayCard(cardName);
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
            <div>
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
              lookCloser(props.cardName);
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
      {showOverlay && <Overlay cardName={overlayCard} />}
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
            coordinates={activeCardMenu.coordinates}
          />
        </OutsideClickHandler>
      )}
      <div className="battlefield">
        <h4>Battlefield</h4>
        {mockBattlefield.map(card => (
          <Card
            key={card.id}
            name={card.name}
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
          onClick={event => handleLibraryClick(event)}
        >
          <h4>Library</h4>
          <h2>{mockLibrary.length}</h2>
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
          {mockGraveyard[0] && (
            <Card
              name={mockGraveyard[0].name}
              click={event => handleClick(event, mockGraveyard[0])}
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
          {mockExile[0] && (
            <Card
              name={mockExile[0].name}
              click={event => handleClick(event, mockExile[0])}
            />
          )}
        </div>
      </div>
      <div className="hand">
        <div className="library">
          <h4>Hand</h4>
          {mockHand.map(card => (
            <Card
              key={card.id}
              name={card.name}
              click={event => handleClick(event, card)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Board;
