import React from "react";
import "./App.css";
import GameHUD from "./GameHUD";
import { getCurrentUser } from "./Login";
import { useParams, Redirect } from "react-router-dom";
import io from "socket.io-client";

interface ILobby {}

const Lobby = (props: ILobby) => {
  const [loggedIn, setLoggedIn] = React.useState<boolean>(true);
  const [users, setUsers] = React.useState<string[]>([]);
  const [socket] = React.useState(() => io("/"));
  const { lobbyId } = useParams();

  React.useEffect(() => {
    const asyncOps = async () => {
      const currentUser = await getCurrentUser();
      setLoggedIn(currentUser.loggedIn);
      if (currentUser.loggedIn) {
        socket.emit("join", lobbyId, currentUser.email);
        setUsers((users) => users.concat(currentUser.email));
      }
    };
    asyncOps();
  }, []);

  React.useEffect(() => {
    if (loggedIn) {
      socket.emit("pingRoom", lobbyId);

      socket.on("userDisconnected", (userEmail: string) => {
        setUsers((users) => {
          const index = users.indexOf(userEmail.toString());
          if (index !== -1) {
            users.splice(index, 1);
          }
          return users;
        });
      });

      socket.on("userConnected", (userEmail: string) => {
        setUsers((users) => users.concat(userEmail));
      });

      socket.on("pongUser", (userId: string) => {
        socket.emit("pong_user", userId);
      });
    }
  }, [loggedIn]);

  return (
    <div className="lobby">
      {loggedIn ? <GameHUD users={users} /> : <Redirect to="/" />}
    </div>
  );
};

export default Lobby;
