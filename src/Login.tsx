import React, {SetStateAction} from "react";
import "./App.css";
import createLobbyLink from "./createLobbyLink";
import { Link } from "react-router-dom";

interface ILogin {
  loggedIn: boolean,
  userEmail: string,
  setLoggedIn: React.Dispatch<SetStateAction<boolean>>,
  setUserEmail: React.Dispatch<SetStateAction<string>>
}

export const getCurrentUser = async () => {
  const response = await fetch("/loggedIn");
  const json = await response.json();
  return json;
};

const Login = (props: ILogin) => {
  const [emailInput, setEmailInput] = React.useState<string>("");
  const [passwordInput, setPasswordInput] = React.useState<string>("");
  const [statusMessage, setStatusMessage] = React.useState<string>("");

  const handleEmailChange = (event: any): void => {
    setEmailInput(event.target.value);
  };

  const handlePasswordChange = (event: any): void => {
    setPasswordInput(event.target.value);
  };

  const handleSubmit = async () => {
    setStatusMessage("");

    const response = await fetch("/login", {
      method: "post",
      body: JSON.stringify({ username: emailInput, password: passwordInput }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.redirected) {
      props.setLoggedIn(false)
      setStatusMessage("Invalid email/password combination.");
    } else {
      props.setLoggedIn(true)
    }
  };

  const handleRegister = async () => {
    setStatusMessage("");

    const response = await fetch("/register", {
      method: "post",
      body: JSON.stringify({ email: emailInput, password: passwordInput }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    switch (response.status) {
      case 401:
        setStatusMessage("Email already in use.");
        break;
      case 200:
        props.setLoggedIn(true)
        break;
      case 400:
        setStatusMessage("Invalid email address.");
        break;
      default:
        setStatusMessage("Internal server error.");
    }
  };

  const handleKeyDown = (event: any): void => {
    if (event.keyCode === 13) {
      handleSubmit();
    }
  };

  return (
    <>
      {props.loggedIn ? (
        <div className="authenticated-banner">
          <p>Logged in as {props.userEmail}</p>
          <Link to="/decks"> My Decks </Link> <br />
          <a href={createLobbyLink()}>Game Lobby</a>
        </div>
      ) : (
        <div className="loginForm">
          Log In: <br />
          <input
            type="text"
            name="email"
            value={emailInput}
            onChange={handleEmailChange}
            placeholder="email"
            onKeyDown={handleKeyDown}
          />
          <input
            type="password"
            name="password"
            value={passwordInput}
            onChange={handlePasswordChange}
            placeholder="password"
            onKeyDown={handleKeyDown}
          />
          <button type="submit" name="submitLogin" onClick={handleSubmit}>
            Login
          </button>
          <button type="submit" name="submitRegister" onClick={handleRegister}>
            Register
          </button>
          <p>{statusMessage}</p>
        </div>
      )}
    </>
  );
};

export default Login;
