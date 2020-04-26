import React from "react";
import "./App.css";
import { useParams } from "react-router-dom";

interface IGameHUD {
  users: string[];
}

const GameHUD = (props: IGameHUD) => {
  const { lobbyId } = useParams();
  return (
    <div>
      <p>Game Lobby ID: {lobbyId}</p>
      {props.users.map((user) => (
        <p key={user}>{user}</p>
      ))}
    </div>
  );
};

export default GameHUD;
