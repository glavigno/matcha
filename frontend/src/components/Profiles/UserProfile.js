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

function UserProfile(props) {
  const [isLoading, setIsLoading] = useState(true);

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
      try {
        if (isSet) setIsLoading(false);
        if (
          props.profile.isblocked === false &&
          props.profile.id !== context.user.id
        ) {
          if (Object.keys(socketContext).length > 0) {
            socketContext.emit(
              "profileVisit",
              props.profile.id,
              context.user.firstname
            );
            fetch("/notification", {
              method: "post",
              headers: headers,
              body: JSON.stringify({
                type: 2,
                visited: props.profile.id,
                visitor: context.user.firstname,
                timestamp: require("moment")().format("MMMM Do, LT")
              })
            });
          }
          fetch("/notification/score", {
            method: "post",
            headers: headers,
            body: JSON.stringify({
              type: 2,
              visited: props.profile.id,
              score: props.profile.score
            })
          });
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchProfile();
    return () => (isSet = false);
  }, [
    context,
    props.profile.id,
    props.history,
    socketContext,
    props.profile.score,
    props.profile.isblocked
  ]);

  return (
    <div className="userProfile">
      <div className="card-container">
        {isLoading ? null : <Card item={props.profile} />}
      </div>
      <div className="infos-container nested-grid">
        <div className="bio-container">
          <div className="aboutme">
            {!props.profile.logged && (
              <h4>
                <i className="fas fa-history" />
                Last connection {moment(props.profile.lastconnection).fromNow()}
              </h4>
            )}
            <h1>About me</h1>
          </div>
          <h4>{props.profile.bio}</h4>
        </div>
        <div className="tags-container">
          {isLoading
            ? null
            : props.profile.tags.map(e => {
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
        {props.profile.id !== context.user.id && (
          <div className="icons-container">
            <ToggleLike
              likedUserId={props.profile.id}
              likedUserScore={props.profile.score}
              Hasliked={props.profile.hasliked}
              isLiked={props.profile.isliked}
              isBlocked={props.profile.isblocked}
            />
            <Report
              {...props}
              reporterUserId={context.user.id}
              reportedUserId={props.profile.id}
              reportedUserScore={props.profile.score}
              onCancel={props.onCancel}
            />
            <Block
              {...props}
              blockerUserId={context.user.id}
              blockedUserId={props.profile.id}
              blockedUserScore={props.profile.score}
              onCancel={props.onCancel}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default UserProfile;
