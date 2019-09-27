import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import "./Footer.css";

import { Badge, Icon, Modal } from "antd";
import AuthContext from "../context/authContext";
import SocketContext from "../context/socketContext";
import Settings from "../../components/Settings/Settings";

import steve from "../../assets/static/gifs/steve.gif";
import nicolas from "../../assets/static/gifs/nicolas.gif";
import james from "../../assets/static/gifs/james.gif";
import veronica from "../../assets/static/gifs/veronica.gif";
import riri from "../../assets/static/gifs/riri.gif";

const gifs = [steve, nicolas, james, veronica, riri];

export default () => {
  const context = useContext(AuthContext);
  const socketContext = useContext(SocketContext);
  const [counter, setCounter] = useState(0);
  const [messages, setMessagesCounter] = useState(0);
  const [modal, setModal] = useState(false);
  const [matchModal, setMatchModal] = useState(false);

  if (Object.keys(socketContext).length > 0) {
    socketContext.on("likeUser", () => {
      const newCounter = counter + 1;
      setCounter(newCounter);
    });
    socketContext.on("profileVisit", () => {
      const newCounter = counter + 1;
      setCounter(newCounter);
    });
    socketContext.on("message-notif", data => {
      const url = window.location.href;
      if (url !== "http://localhost:3000/chat")
        setMessagesCounter(messages + 1);
    });
    socketContext.on("match", data => {
      const newCounter = counter + 1;
      setCounter(newCounter);
      setMatchModal(true);
    });
  }

  useEffect(() => {
    let isSet = true;
    const fetchNotifications = async () => {
      const res = await fetch(`/notification/unread`, {
        headers: { token: context.token, id: context.user.id }
      });
      try {
        if (res) {
          if (res.status === 200) {
            if (isSet) {
              let ret = await res.json();
              setCounter(ret);
            }
          } else {
            console.log("Access denied!");
          }
        }
      } catch (err) {
        console.log(err);
      }
    };
    const fetchMessagesNotifs = async () => {
      const res = await fetch(`/chat/unread`, {
        headers: { token: context.token, id: context.user.id }
      });
      try {
        if (res) {
          if (res.status === 200) {
            if (isSet) {
              let ret = await res.json();
              setMessagesCounter(ret);
            }
          } else {
            console.log("Access denied!");
          }
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchNotifications();
    fetchMessagesNotifs();
    return () => (isSet = false);
  }, [context.token, context.user.id]);

  const handleNotifs = () => {
    setCounter(0);
  };

  const handleMessages = () => {
    setMessagesCounter(0);
  };

  const showModal = () => {
    setModal(true);
  };

  const cancel = () => {
    setModal(false);
  };

  const cancelMatchModal = () => {
    setMatchModal(false);
  };

  return (
    <footer className="footer__main">
      <Link to="/profiles/matcher" className="link">
        <Icon type="fire" style={{ fontSize: "32px" }} />
      </Link>
      <Link to="/profiles" className="link">
        <Icon type="filter" style={{ fontSize: "32px" }} />
      </Link>
      <Link to="/notifications" className="link" onClick={handleNotifs}>
        <Badge count={counter}>
          <Icon type="notification" style={{ fontSize: "32px" }} />
        </Badge>
      </Link>
      <Link to="/chat" className="link" onClick={handleMessages}>
        <Badge count={messages}>
          <Icon type="message" style={{ fontSize: "32px" }} />
        </Badge>
      </Link>
      <Icon
        type="setting"
        className={context.user.is_complete ? "link" : "link focus"}
        style={{ fontSize: "32px" }}
        onClick={showModal}
      />
      <Modal
        centered
        visible={modal}
        onCancel={cancel}
        width="60%"
        footer={[]}
        destroyOnClose={true}
      >
        <Settings cancelModal={cancel} />
      </Modal>
      <Modal
        centered={true}
        visible={matchModal}
        onCancel={cancelMatchModal}
        destroyOnClose={true}
      >
        <div className="img-match-container" style={{ zIndex: 5 }}>
          <img
            src={gifs[Math.floor(Math.random() * gifs.length)]}
            alt=""
            width="100%"
          ></img>
          <h1 style={{ textAlign: "center" }}>Congrats, you got a match !</h1>
        </div>
      </Modal>
    </footer>
  );
};
