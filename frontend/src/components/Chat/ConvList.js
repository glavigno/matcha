import React, { useEffect, useContext, useState } from "react";
import { filterConvs, enterRoom, quitRoom } from "./chatUtils";

import "../../assets/css/ChatMain.css";
import "./ChatList.css";
import { Link } from "react-router-dom";
import { Icon } from "antd";
import Conv from "./Conv";
import AuthContext from "../context/authContext";
import SocketContext from "../context/socketContext";

export default props => {
  /* ------CONTEXT USE --------------------------------------------------------------------- */

  const context = useContext(AuthContext);
  const socketContext = useContext(SocketContext);

  const [Convs, setConvs] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentConvIndex = props.index;

  useEffect(() => {
    let isSet = true;
    const fetchConvs = async () => {
      const res = await fetch(`/chat/convs`, {
        headers: { token: context.token, user: context.user.id }
      });
      try {
        if (res) {
          if (res.status === 200) {
            if (isSet) {
              let convs = await res.json();
              const filteredConvs = filterConvs(convs, context.user.id);
              if (filteredConvs.length === 0) {
                props.setConv(0, { noconv: true }, false);
              } else {
                setConvs([...filteredConvs]);
                enterRoom(socketContext, filteredConvs[currentConvIndex].id);
                if (props.conv.id === undefined)
                  props.setConv(0, filteredConvs[0], false);
                setLoading(false);
              }
            }
          } else {
            console.log("Access denied!");
          }
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchConvs();
    return () => (isSet = false);
  }, [
    props.index,
    context.token,
    context.user.id,
    currentConvIndex,
    props,
    socketContext
  ]);

  const onClick = (index, conv) => {
    quitRoom(socketContext, Convs[currentConvIndex].id);
    props.setConv(index, conv, true);
  };

  if (!loading) {
    return (
      <div className="chatlist__main">
        {!props.mobile && (
          <div className="current-conv-infos">
            <Link
              key={Convs[currentConvIndex].id_receiver}
              to={`/profiles/${Convs[currentConvIndex].id_receiver}`}
            >
              <img alt="pic" src={Convs[currentConvIndex].avatar[0]} />
            </Link>
          </div>
        )}
        <ul>
          {Convs.map((conv, index) => (
            <Conv
              key={index}
              content={conv}
              onClick={onClick}
              currentconv={Convs[currentConvIndex].id}
              index={index}
              mobile={props.mobile}
            />
          ))}
        </ul>
      </div>
    );
  } else {
    return <Icon type="loading" style={{ fontSize: 48 }} spin />;
  }
};
