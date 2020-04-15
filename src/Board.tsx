import React from "react";
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
    console.log("Board::handleClick:card:", card);
    console.log("event:", event);
    console.log(
      "event.currentTarget.getBoundingClientRect:",
      event.currentTarget.getBoundingClientRect()
    );
    // show actions for that card
    setActiveCardMenu({
      card: card,
      coordinates: {
        top: event.currentTarget.getBoundingClientRect().y,
        left: event.currentTarget.getBoundingClientRect().x
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
          <button
            onClick={() => {
              moveCardToZone(mockLibrary[0].id, "HAND");
              setShowLibraryMenu(false);
            }}
          >
            Draw
          </button>
        </div>
      </div>
    );
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
              <button
                onClick={() => {
                  moveCardToZone(props.cardId, zone);
                  setActiveCardMenu(null);
                }}
              >
                Send to {zone.toString()}
              </button>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {activeCardMenu && (
        <CardMenu
          cardId={activeCardMenu.card.id}
          coordinates={activeCardMenu.coordinates}
        />
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
          {showLibraryMenu && <LibraryMenu />}
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
