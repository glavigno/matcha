import React, { useContext } from "react";
import AuthContext from "../context/authContext";
const moment = require("moment");

export default props => {
  const timestamp = props.content.hasOwnProperty("timestamp")
    ? moment(props.content.timestamp)
        .utc()
        .format("MMMM Do, LT")
    : moment().format("MMMM Do, LT");
  const context = useContext(AuthContext);
  const { content, sender } = props.content;
  const msgClass = sender === context.user.id ? "bluemsg" : "";
  const tmstmpClass = sender === context.user.id ? "left-ts" : "right-ts";

  return (
    <li>
      <div className="message__core">
        <h3 className={msgClass}>{content}</h3>
      </div>
      <p className={tmstmpClass}>{timestamp}</p>
    </li>
  );
};
