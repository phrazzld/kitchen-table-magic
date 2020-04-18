import React from "react";
import "./App.css";
import GameHUD from './GameHUD';
import {checkLogin} from './Login'
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';


interface ILobby {}

const Lobby = (props: ILobby) => {
  const [loggedIn, setLoggedIn] = React.useState<boolean>(false);
  const [users, setUsers] = React.useState<string[]>([]);
  const [email, setEmail] = React.useState<string>('');
  const [socket, setSocket] = React.useState(()=>io('/'));
  const [update, setUpdate] = React.useState<string>('');
  const { id } = useParams();

  React.useEffect(() => {
    const temp = users;

  }, [users]);

  React.useEffect(() => {

    const asyncOps= async () => {
      const loginStatus = await checkLogin();
      setLoggedIn(loginStatus.logged_in);
      socket.emit('join', id, loginStatus.email);
      setUsers((userArray) => userArray.concat([loginStatus.email]));
      setEmail(loginStatus.email);
    }
    asyncOps();
  }, []);

  React.useEffect(() => {
    if(email) {
      socket.emit('ping_room', id);

      socket.on('user_disconnected', (user: string) => {
        setUsers((users) => {
          const index = users.indexOf(user.toString());
          if(index != -1){
            users.splice(index, 1);
          }
          return users;
        });
      });

      socket.on('user_connected', (user: string) => {
        setUsers((userArray) => userArray.concat([user]));
      });

      socket.on('pong_user', (userId: string) => {
        socket.emit('pong_user', userId);
      });

      socket.on('update', (update: string) => {
        setUpdate(email);
      });
    }
  }, [email]);


  const handleClick = (): void => {
    socket.emit('update', 'yoyoyo');
  }


  return (
    <>
      <div className = 'App'>
        { loggedIn
          ? (
            <>
              <GameHUD users={users}/>
              <button onClick = {handleClick}>Test</button>
              {update}
            </>
          )
          : (
            <p>login required</p>
          )
        }
      </div>
    </>
  );
};

export default Lobby;
