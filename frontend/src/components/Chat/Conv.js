import React, { useContext, useState, useEffect } from "react";
import { readConv, quitRoom } from "./chatUtils";
import AuthContext from "../context/authContext";
import SocketContext from "../context/socketContext";

import { Badge } from "antd";

export default props => {
  /* ------CONTEXT USE ------------------------------------------------------------------- */

  const context = useContext(AuthContext);
  const socketContext = useContext(SocketContext);

  const conv = props.content;
  const { firstname, avatar, logged, id_receiver } = props.content;
  const unreadDb = parseInt(conv.unread);
  const index = props.index;

  const [unread, setUnread] = useState(unreadDb);
  const [preview, setPreview] = useState(conv.preview);
  const [previewClass, setPreviewClass] = useState(
    conv.preview_sender !== context.user.id &&
      unread !== 0 &&
      props.currentconv !== conv.id
      ? "bold-preview"
      : "regular-preview"
  );
  const [status, setStatus] = useState(logged ? true : false);

  useEffect(() => {
    let isSet = true;
    socketContext.on("logUser", data => {
      const url = window.location.href;
      if (
        url === "http://localhost:3000/chat" &&
        id_receiver === parseInt(data)
      ) {
        if (isSet) setStatus(true);
      }
    });
    socketContext.on("logOutUser", (data, nb) => {
      const url = window.location.href;
      if (
        url === "http://localhost:3000/chat" &&
        id_receiver === parseInt(data) &&
        nb === 1
      ) {
        if (isSet) setStatus(false);
      }
    });
    return () => (isSet = false);
  }, [status, socketContext, id_receiver]);

  useEffect(() => {
    let isSet = true;
    if (isSet) {
      socketContext.on("message-notif", data => {
        const url = window.location.href;
        if (url === "http://localhost:3000/chat") {
          const ParsedRoomId = parseInt(data.roomId);
          if (ParsedRoomId === conv.id) {
            setPreview(data.content);
            if (props.currentconv === conv.id) {
              setUnread(0);
              if (data.sender !== context.user.id) {
                readConv(ParsedRoomId, context.token, context.user.id);
              }
              setPreviewClass("regular-preview");
            } else {
              setPreviewClass("bold-preview");
              setUnread(unread + 1);
            }
          }
        }
      });
    }
    return () => (isSet = false);
  }, [
    unread,
    socketContext,
    context.token,
    conv.id,
    context.user.id,
    props.currentconv
  ]);

  useEffect(() => {
    return () => {
      quitRoom(socketContext, conv.id);
    };
  }, [socketContext, conv.id]);

  const handleClick = () => {
    setUnread(0);
    if (props.currentconv !== conv.id) {
      readConv(conv.id, context.token, context.user.id);
      setPreviewClass("regular-preview");
      props.onClick(index, conv);
    }
    if (props.mobile === true) props.onClick(index, conv);
  };

  return (
    <li onClick={handleClick}>
      <div className={props.currentconv === conv.id ? "conv dark" : "conv"}>
        <div className="chat-img-container">
          <img alt="pic" src={avatar[0]} />
          <div className={status ? "active-circle-" : null} />
        </div>
        <div className="name-preview-container">
          <h2>{firstname}</h2>
          <h3 className={previewClass}>
            {preview !== null && preview.length > 15
              ? `${preview.substring(0, 15)}...`
              : preview}
          </h3>
        </div>
        {unread !== 0 && (
          <div className="unread-circle">
            <Badge count={unread} />
          </div>
        )}
      </div>
    </li>
  );
};
