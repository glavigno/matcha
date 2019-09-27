import React, { useRef } from "react";
import useWindowDimensions from "../Misc/useWindowDimensions";

import Message from "./Message";

export default props => {
  const uniqid = require("uniqid");
  const myRef = useRef(null);
  const { width, height } = useWindowDimensions();
  const messagesStyleHeight = width <= 700 ? height - 300 : null;

  if (props.messages !== undefined && props.messages.length > 0) {
    return (
      <div className="messages__container">
        <ul style={{ height: `${messagesStyleHeight}px` }}>
          {props.messages.map(elem => (
            <Message key={uniqid()} content={elem} />
          ))}
          <div style={{ float: "left", clear: "both" }} ref={myRef}></div>
        </ul>
      </div>
    );
  } else {
    return true;
  }
};
