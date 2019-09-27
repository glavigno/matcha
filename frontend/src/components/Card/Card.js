import React, { useContext, useEffect, useState } from "react";
import { Carousel, Modal } from "antd";

import "antd/dist/antd.css";

import "./Card.css";
import SocketContext from "../context/socketContext";
import moment from "moment";
import UserProfile from "../Profiles/UserProfile";

const Card = props => {
  const {
    id,
    firstname,
    age,
    avatar,
    city,
    logged,
    hasliked,
    isliked,
    score,
    palette
  } = props.item;
  const socketContext = useContext(SocketContext);
  let matchIconClass = "";

  /* ------STATE VARIABLES---------------------------------------------------------------- */

  const [modalState, setModalState] = useState(false);
  const [status, setStatus] = useState(logged ? true : false);

  useEffect(() => {
    let isSet = true;
    if (isSet) {
      socketContext.on("logUser", data => {
        const url = window.location.href;
        if (url === "http://localhost:3000/profiles" && id === parseInt(data)) {
          setStatus(true);
        }
      });
      socketContext.on("logOutUser", (data, nb) => {
        const url = window.location.href;
        if (
          url === "http://localhost:3000/profiles" &&
          id === parseInt(data) &&
          nb === 1
        ) {
          setStatus(false);
        }
      });
    }
    return () => (isSet = false);
  }, [status, id, socketContext]);

  const carouselPics = avatar.map((e, index) => (
    <div key={index}>
      <img src={e} alt="profilePicture" onClick={() => setModalState(true)} />
    </div>
  ));

  if (hasliked && isliked) matchIconClass = "💖";
  else if (hasliked) matchIconClass = "💘";
  else if (isliked) matchIconClass = "💗";

  return (
    <div className="card" style={{ background: palette }}>
      <div className={status ? "active-circle" : "off-circle"} />
      <Modal
        centered
        footer={null}
        visible={modalState}
        onCancel={() => setModalState(false)}
        width="50%"
        destroyOnClose={true}
      >
        <UserProfile
          profile={props.item}
          onCancel={() => setModalState(false)}
        />
      </Modal>
      <Carousel autoplay>{carouselPics}</Carousel>
      <div className="bottom-card">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <h1>{firstname}</h1>
          <h3>
            <i
              className={
                score > 750
                  ? "fas fa-fire"
                  : score > 300
                  ? "fas fa-star-half-alt"
                  : "fas fa-snowflake"
              }
            ></i>{" "}
            {score}
          </h3>
        </div>
        <h3>{moment().diff(age, "years", false)} years old</h3>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >
          <h3>
            <i className="fas fa-map-marker-alt"></i> {city}
          </h3>
          <p style={{ margin: "0" }}>{matchIconClass}</p>
        </div>
      </div>
    </div>
  );
};

export default Card;
