import React from "react";
import "./App.css";
import { useParams } from "react-router-dom";

interface IGameHUD {
  users: string[];
}

const GameHUD = (props: IGameHUD) => {
  const { id } = useParams();
  return (
    <>
      <p>Game Lobby ID: {id}</p>
      {props.users.map((user) => (
        <p key={user}>{user}</p>
      ))}
    </>
  );
};

export default GameHUD;
