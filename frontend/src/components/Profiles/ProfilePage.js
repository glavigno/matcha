// Libraries
import React, { useState, useEffect, useContext } from "react";

// Import css
import "./UserProfile.css";

import AuthContext from "../context/authContext";
import SocketContext from "../context/socketContext";
import Card from "../Card/Card";
import ToggleLike from "../Likes/ToggleLike";
import Report from "./Report";
import Block from "./Block";
import moment from "moment";

import { Icon } from "antd";

export default props => {
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState({});
  const context = useContext(AuthContext);
  const socketContext = useContext(SocketContext);
  const colors = ["#FBE8A3", "#E3B594", "#FAAFB7", "#C794E3", "#B3C1FF"];

  useEffect(() => {
    let isSet = true;
    const fetchProfile = async () => {
      const headers = {
        "Content-Type": "application/json",
        "Access-Control-Origin": "*"
      };
      const res = await fetch(`/profiles/${props.match.params.id}`, {
        headers: { token: context.token, currentUserId: context.user.id }
      });
      try {
        if (res) {
          if (isSet) {
            let userProfile = await res.json();
            if (res.status === 400 && userProfile.text === "Invalid user")
              props.history.push("/profiles");
            else if (res.status === 200) {
              setProfile(userProfile);
              setIsLoading(false);
              if (Object.keys(socketContext).length > 0) {
                if (userProfile.id !== context.user.id) {
                  socketContext.emit(
                    "profileVisit",
                    userProfile.id,
                    context.user.firstname
                  );
                  fetch("/notification", {
                    method: "post",
                    headers: headers,
                    body: JSON.stringify({
                      type: 2,
                      visited: userProfile.id,
                      visitor: context.user.firstname,
                      timestamp: require("moment")().format("MMMM Do, LT")
                    })
                  });
                }
              }
              if (userProfile.id !== context.user.id) {
                fetch("/notification/score", {
                  method: "post",
                  headers: headers,
                  body: JSON.stringify({
                    type: 2,
                    visited: userProfile.id,
                    score: userProfile.score
                  })
                });
              }
            } else {
              props.history.push("/");
              setIsLoading(false);
              context.logout();
            }
          }
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchProfile();
    return () => (isSet = false);
  }, [
    context,
    profile.id,
    profile.score,
    props.history,
    props.match.params.id,
    socketContext
  ]);

  if (isLoading) return <Icon type="loading" style={{ fontSize: 48 }} spin />;
  else
    return (
      <div className="userProfile">
        <div className="card-container">
          {isLoading ? null : <Card item={profile} />}
        </div>
        <div className="infos-container nested-grid">
          <div className="bio-container">
            <div className="aboutme">
              {!profile.logged && (
                <h4>
                  <i className="fas fa-history" />
                  Last connection {moment(profile.lastconnection).fromNow()}
                </h4>
              )}
              <h1>About me</h1>
            </div>
            <h3>{profile.bio}</h3>
          </div>
          <div className="tags-container">
            {isLoading
              ? null
              : profile.tags.map(e => {
                  let color = colors[Math.floor(Math.random() * colors.length)];
                  return (
                    <h3
                      key={e}
                      className="tag-style"
                      style={{ background: color }}
                    >
                      {e}
                    </h3>
                  );
                })}
          </div>
          {profile.id !== context.user.id && (
            <div className="icons-container">
              <ToggleLike
                likedUserId={profile.id}
                likedUserScore={profile.score + 5}
                Hasliked={profile.hasliked}
                isLiked={profile.isliked}
              />
              <Report
                {...props}
                reporterUserId={context.user.id}
                reportedUserId={profile.id}
                reportedUserScore={profile.score}
              />
              <Block
                {...props}
                blockerUserId={context.user.id}
                blockedUserId={profile.id}
                blockedUserScore={profile.score}
              />
            </div>
          )}
        </div>
      </div>
    );
};
