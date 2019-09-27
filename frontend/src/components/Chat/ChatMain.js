import React, { useEffect, useState } from "react";

import "../../assets/css/ChatMain.css";
import ConvList from "./ConvList";
import Chat from "./Chat";
import useWindowDimensions from "../Misc/useWindowDimensions";
import "./ChatList.css";
import noconv from "../../assets/static/svg/noconv.svg";

export default () => {
  /* ------STATE VARIABLES---------------------------------------------------------------- */

  const [currentConv, setCurrentConv] = useState({ index: 0, conv: {} });
  const [mobile, setMobile] = useState(false);
  const [toggle, setToggle] = useState(false);
  const { width, height } = useWindowDimensions();

  const setConv = (index, conv, mob) => {
    setCurrentConv({ index: index, conv: conv });
    if (mobile === true && mob === true) {
      setToggle(true);
    }
  };

  const setMobileView = view => {
    setToggle(view);
  };

  useEffect(() => {
    if (width <= 700) setMobile(true);
    else if (width > 700) setMobile(false);
  }, [width, height]);

  if (currentConv.conv.noconv !== true) {
    if (mobile === false) {
      return (
        <div className="chat__container">
          <ConvList
            index={currentConv.index}
            setConv={setConv}
            conv={currentConv.conv}
          />
          <Chat conv={currentConv.conv} />
        </div>
      );
    } else if (mobile === true) {
      return toggle === true ? (
        <Chat
          conv={currentConv.conv}
          mobile={mobile}
          setToggle={setMobileView}
        />
      ) : (
        <ConvList
          index={currentConv.index}
          setConv={setConv}
          conv={currentConv.conv}
          mobile={mobile}
        />
      );
    }
  } else {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <img src={noconv} alt=""></img>
        <h1>No conversations available</h1>
      </div>
    );
  }
};
