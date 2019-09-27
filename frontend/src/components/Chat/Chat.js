import React, { useContext, useEffect, useState } from "react";
import { enterRoom, quitRoom } from "./chatUtils";
import { Link } from "react-router-dom";

import { Button, Icon, Input } from "antd";
import "./Chat.css";

import AuthContext from "../context/authContext";
import SocketContext from "../context/socketContext";

import Messages from "./Messages";

export default props => {
  /* ------CONTEXT USE ------------------------------------------------------------------- */

  const context = useContext(AuthContext);
  const socketContext = useContext(SocketContext);

  /* ------STATE VARIABLES---------------------------------------------------------------- */

  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const receiver = props.conv.id_receiver;
  const room = props.conv.id;

  /* ------FETCH PREVIOUS MSGS------------------------------------------------------------ */

  useEffect(() => {
    let isSet = true;
    if (isSet) {
      setIsLoading(true);
      const fetchMessages = async () => {
        const res = await fetch(`/chat/getmessages`, {
          headers: {
            token: context.token,
            match_id: room,
            reader: context.user.id
          }
        });
        try {
          if (res) {
            if (res.status === 200) {
              const ret = await res.json();
              setMessages(ret.messages);
              setIsLoading(false);
            } else {
              console.log("Access denied!");
            }
          }
        } catch (err) {
          console.log(err);
        }
      };
      if (props.conv.id !== undefined) fetchMessages();
    }
    return () => (isSet = false);
  }, [props.conv, context.token, room, context.user.id]);

  /* ------RECEIVE MSG SOCKET----------------------------------------------------------- */

  useEffect(() => {
    let isSet = true;
    if (isSet) {
      socketContext.on("message_receive", data => {
        const url = window.location.href;
        if (url === "http://localhost:3000/chat") {
          const newMessages = [...messages, data];
          setMessages(newMessages);
        }
      });
    }
    return () => (isSet = false);
  }, [props.mobile, room, socketContext, messages]);

  /* ------SAVE MESSAGE IN DB AND NOTIFY------------------------------------------------ */

  const saveMessage = msgObj => {
    const headers = {
      "Content-Type": "application/json",
      "Access-Control-Origin": "*"
    };
    fetch("/chat/savemessage", {
      method: "post",
      headers: headers,
      body: JSON.stringify(msgObj)
    })
      .then(res => res.json())
      .catch(error => console.log(error));
  };

  /* ------HANDLE INTERACTION----------------------------------------------------------- */

  const handleChange = e => {
    setText(e.target.value);
  };

  const handleKeyPress = e => {
    if (e.key === "Enter") {
      handleSend(e);
    }
  };

  const handleSend = e => {
    e.preventDefault();
    if (text !== "") {
      const msgObj = { content: text, sender: context.user.id };
      const newMessages = [...messages, msgObj];
      setMessages(newMessages);
      saveMessage({ ...msgObj, roomId: room, receiver: receiver });
      socketContext.emit("message_send", {
        ...msgObj,
        roomId: room,
        receiver: receiver
      });
      setText("");
    }
  };

  const handleBack = () => {
    props.setToggle(false);
  };

  useEffect(() => {
    if (props.mobile) enterRoom(socketContext, room);
    return () => {
      if (props.mobile) quitRoom(socketContext, room);
    };
  }, [props.mobile, room, socketContext]);

  if (!isLoading) {
    return (
      <div className="chat__main">
        {props.mobile && (
          <div className="chat_infos_container_mobile">
            <Button shape="round" onClick={handleBack}>
              <i className="fas fa-arrow-left"></i>
            </Button>
            <Link key={receiver} to={`/profiles/${receiver}`}>
              <img alt="pic" src={props.conv.avatar[0]} />
            </Link>
            <h2>{props.conv.firstname}</h2>
          </div>
        )}
        <Messages messages={messages} />
        <div className="chat__send">
          <Input
            value={text}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
          />
          <Button onClick={handleSend}>Send message</Button>
        </div>
      </div>
    );
  } else {
    return <Icon type="loading" style={{ fontSize: 48 }} spin />;
  }
};
