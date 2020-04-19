import React from "react";
import "./App.css";
import { Link } from "react-router-dom";

const CreateLobbyLink = (): string => {
  const href =
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);
  return `http://localhost:3000/game/${href}`;
};

export default CreateLobbyLink;
