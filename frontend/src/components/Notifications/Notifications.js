import React, { useContext, useEffect, useState } from "react";
import Notif from "./Notif";
import { Icon } from "antd";
import "./Notifications.css";

import AuthContext from "../context/authContext";
import bell from "../../assets/static/svg/bell.svg";

export default () => {
  const context = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    let isSet = true;
    const fetchNotifications = async () => {
      const res = await fetch(`/notification`, {
        headers: { token: context.token, id: context.user.id }
      });
      try {
        if (res) {
          if (res.status === 200) {
            if (isSet) {
              let userNotifications = await res.json();
              setNotifications([...userNotifications]);
              setIsLoading(false);
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
    return () => (isSet = false);
  }, [context.user, context.token]);

  useEffect(() => {
    const readNotifications = async () => {
      await fetch(`/notification/read`, {
        headers: { token: context.token, id: context.user.id }
      });
    };
    readNotifications();
  }, [context.user, context.token]);

  if (isLoading) return <Icon type="loading" style={{ fontSize: 48 }} spin />;
  else {
    if (notifications.length > 0) {
      return (
        <div className="notifications__wrapper">
          {notifications.map(elem => (
            <Notif key={elem.uuid} {...elem} />
          ))}
        </div>
      );
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
          <img src={bell} alt=""></img>
          <h1>No notifications for you</h1>
        </div>
      );
    }
  }
};
