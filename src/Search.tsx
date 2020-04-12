import React from "react";
import "./App.css";
import Card from "./Card";

interface ISearch {}

const Search = (props: ISearch) => {
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

  const handleClick = () => {
    console.log("Search::handleClick");
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
      {cardName && <Card name={cardName} click={handleClick} />}
    </div>
  );
};

export default Search;
