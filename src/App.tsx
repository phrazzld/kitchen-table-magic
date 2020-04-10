import React from "react";
import "./App.css";
import Card from "./Card";

function App() {
  const [searchText, setSearchText] = React.useState<string>("");
  const [cardName, setCardName] = React.useState<string>("");

  const handleKeyDown = (event: any): void => {
    if (event.keyCode === 13) {
      setCardName(searchText);
    }
  };

  const handleInputChange = (event: any): void => {
    setSearchText(event.target.value);
  };

  const handleSearch = (event: any): void => {
    setCardName(searchText);
  };

  return (
    <div className="App" onKeyDown={handleKeyDown}>
      Card Name:
      <input
        type="text"
        name="cardName"
        value={searchText}
        onChange={handleInputChange}
      />
      <button type="submit" name="search" onClick={handleSearch}>
        Search
      </button>
      {cardName && <Card name={cardName} />}
    </div>
  );
}

export default App;
