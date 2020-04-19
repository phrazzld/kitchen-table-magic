import React from "react";
import "./App.css";
import CreateLobbyLink from "./CreateLobbyLink";

interface ILogin {}

export const checkLogin = async () => {
  console.log("logging in");
  const response = await fetch("/loggedIn");
  const json = await response.json();
  return json;
};

const Login = (props: ILogin) => {
  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [statusMessage, setStatusMessage] = React.useState<string>("");
  const [loginStatus, setLoginStatus] = React.useState<boolean>(false);
  const [loginEmail, setLoginEmail] = React.useState<string>("");

  const handleEmailChange = (event: any): void => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: any): void => {
    setPassword(event.target.value);
  };

  const handleSubmit = async () => {
    const response = await fetch("/login", {
      method: "post",
      body: JSON.stringify({ username: email, password }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.redirected) {
      setLoginStatus(false);
      setStatusMessage("Invalid email/password combination.");
    } else {
      setLoginEmail(email);
      setLoginStatus(true);
    }
  };

  const handleRegister = async () => {
    const response = await fetch("/register", {
      method: "post",
      body: JSON.stringify({ email, password }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log(response.status);
    if (response.status === 401) {
      setStatusMessage("Email already in use.");
    } else if (response.status === 200) {
      setLoginEmail(email);
      setLoginStatus(true);
    } else if (response.status === 400) {
      setStatusMessage("Invalid email address.");
    } else {
      setStatusMessage("Internal server error.");
    }
  };

  const handleKeyDown = (event: any): void => {
    if (event.keyCode === 13) {
      handleSubmit();
    }
  };

  React.useEffect(() => {
    const temp = async () => {
      const loggedIn = await checkLogin();
      setLoginStatus(loggedIn.logged_in);
      setLoginEmail(loggedIn.email);
    };
    temp();
  }, []);

  React.useEffect(() => {
    setStatusMessage("");
  }, [email, password]);

  return (
    <>
      {loginStatus ? (
        <>
          <p>Logged in as {loginEmail}</p>
          <a href={CreateLobbyLink()}>Game Lobby</a>
        </>
      ) : (
        <>
          Log In: <br />
          <input
            type="text"
            name="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="email"
            onKeyDown={handleKeyDown}
          />
          <input
            type="password"
            name="password"
            value={password}
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
        </>
      )}
    </>
  );
};

export default Login;
