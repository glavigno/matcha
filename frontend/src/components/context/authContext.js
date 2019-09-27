import React from "react";

export default React.createContext({
  user: null,
  token: null,
  login: (user, token) => {},
  logout: () => {},
  update: data => {},
  socket: null
});
