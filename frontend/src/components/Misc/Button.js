// Libraries
import React, { useContext } from "react";
import { Link } from "react-router-dom";

import "../assets/css/Button.css";

import AuthContext from "../context/authContext";

function Button(props) {
  const context = useContext(AuthContext);

  function handleClick() {
    if (props.path === "/") {
      context.logout();
    }
  }

  return (
    <Link to={props.path}>
      <button
        style={{
          color: props.color,
          backgroundColor: props.background
        }}
        className="button"
        onClick={handleClick}
      >
        {props.text}
      </button>
    </Link>
  );
}

export default Button;
