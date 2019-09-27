import React from "react";

import { Icon } from "antd";

export default props => {
  let icon;
  let content;
  const notification = {
    MATCH: 1,
    VISIT: 2,
    LIKE: 3,
    DISLIKE: 4
  };

  if (notification.MATCH === props.type) {
    icon = "thunderbolt";
    content = "Congrats ! You got a match";
  } else if (notification.VISIT === props.type) {
    icon = "monitor";
    content = `${props.visitor_firstname} visited your profile`;
  } else if (notification.LIKE === props.type) {
    icon = "heart";
    content = `You received a like from ${props.visitor_firstname}`;
  } else if (notification.DISLIKE === props.type) {
    icon = "dislike";
    content = `Oh no ! ${props.visitor_firstname} disliked you`;
  } else {
    content = "Placeholder";
  }
  return (
    <div className="notif__main">
      <Icon style={{ fontSize: "32px" }} type={icon} />
      <p>{content}</p>
      <h5>{props.timestamp}</h5>
    </div>
  );
};
