import React from "react";
import Search from "./Search";
import Board from "./Board";
import CreateLink from './CreateLink';
import io from 'socket.io-client';

function App() {
  const socket = io('http://localhost:8080');
  socket.on('chat', (message: String) => {
    console.log(message);
  });

  socket.emit('chat', 'yoyoyo');

  return (
    <>
      <Search />
      <Board />
      <CreateLink />
    </>
  );
}

export default App;
