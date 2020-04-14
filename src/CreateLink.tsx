import React from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

interface ICreateLink {}

const CreateLink = (props: ICreateLink) => {
    const [lobbyString, setLobbyString] = React.useState<string>('');
    const handleCreate = (event: any): void => {
      const href = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      setLobbyString(`/game/${href}`);
    };
    return (
      <Router>
        <div className="App">
          <button type="submit" name="search" onClick={handleCreate}>
            Create Game Link
          </button>
            Game Link: <Link to = {lobbyString}>{lobbyString}</Link>
        </div>
      </Router>
    );
};

export default CreateLink;
