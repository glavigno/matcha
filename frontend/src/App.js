import React, { useEffect, useState } from "react";

import AuthApp from "./AuthApp";
import UnauthApp from "./UnauthApp";

import AuthContext from "./components/context/authContext";
import SocketContext from "./components/context/socketContext";
import io from "socket.io-client";

export default () => {
  const [isAuth, setIsAuth] = useState(false);
  const [socket, setSocket] = useState({});
  const [state, setState] = useState({
    user: JSON.parse(localStorage.getItem("user")),
    token: localStorage.getItem("token")
  });

  useEffect(() => {
    let isSet = true;
    if (isSet) {
      if (state.user === null) {
        setIsAuth(false);
      } else if (state.token !== null) {
        fetch(`/auth/${state.token}`)
          .then(res => {
            setIsAuth(res.ok ? true : false);
          })
          .catch(e => console.log(e));
      }
    }
    return () => (isSet = false);
  }, [state.user, state.token]);

  useEffect(() => {
    let isSet = true;
    if (isSet) {
      if (window.performance && state.user) {
        if (
          performance.navigation.type === 0 ||
          performance.navigation.type === 1
        ) {
          const userSocket = io("http://localhost:6200", {
            query: { userId: state.user.id }
          });
          setSocket(userSocket);
        }
      }
    }
    return () => (isSet = false);
  }, [state.user]);

  const login = (user, token) => {
    if (
      user.latitude === null ||
      user.longitude === null ||
      user.city === null
    ) {
      fetch("https://api.ipify.org/?format=json")
        .then(res => res.json())
        .then(data => {
          fetch(`http://ip-api.com/json/${data.ip}`)
            .then(res => res.json())
            .then(data => {
              user.latitude = parseFloat(data.lat);
              user.longitude = parseFloat(data.lon);
              user.city = data.city;
              setState(prevState => ({ ...prevState, user: user }));
              localStorage.setItem("user", JSON.stringify(user));
            })
            .catch(e => console.log(e));
        })
        .catch(e => console.log(e));
    }
    setState({ user: user, token: token, logged: true });
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);
    localStorage.setItem("socket", socket);
  };

  const logout = () => {
    setState({ user: null, token: null, logged: false });
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("socket");
    socket.disconnect();
  };

  const update = data => {
    setState(prevState => ({
      ...prevState,
      user: data
    }));
    localStorage.setItem("user", JSON.stringify(data));
  };

  return (
    <SocketContext.Provider value={socket}>
      <AuthContext.Provider
        value={{
          user: state.user,
          token: state.token,
          login: login,
          logout: logout,
          update: update
        }}
      >
        {isAuth ? <AuthApp /> : <UnauthApp />}
      </AuthContext.Provider>
    </SocketContext.Provider>
  );
};
