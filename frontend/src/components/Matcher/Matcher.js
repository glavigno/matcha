// Libraries
import React, { useState, useEffect, useContext } from "react";

// Import component and css
import "./Matcher.css";
import MatcherZone from "./MatcherZone";
import AuthContext from "../context/authContext";
import SocketContext from "../context/socketContext";
import LikeZone from "../Likes/LikeZone";

import { Icon } from "antd";
import { filterProfiles } from "./matcherUtils";
import info from "../../assets/static/svg/info.svg";

const Matcher = props => {
  const context = useContext(AuthContext);
  const socketContext = useContext(SocketContext);

  const [Index, setIndex] = useState(0);
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  socketContext.on("likeUser", (likedUserId, interested, userId) => {
    setProfiles(
      profiles.map(e => {
        if (e.id === userId) {
          return { ...e, isliked: interested ? true : false };
        } else return e;
      })
    );
  });

  useEffect(() => {
    let isSet = true;
    const fetchSuggestedProfiles = async () => {
      if (context.token) {
        const res = await fetch("/profiles/matcher", {
          headers: { token: context.token, user: context.user.id }
        });
        try {
          if (res) {
            if (res.status === 200) {
              if (isSet) {
                const suggestedProfiles = await res.json();
                setProfiles(filterProfiles(suggestedProfiles, context.user));
                setLoading(false);
              }
            } else {
              console.log("Access denied!");
            }
          }
        } catch (err) {
          console.log(err);
        }
      }
    };
    fetchSuggestedProfiles();
    return () => (isSet = false);
  }, [context.token, context.user, context.user.id]);

  if (loading) return <Icon type="loading" style={{ fontSize: 48 }} spin />;
  else if (!loading && context.user.is_complete) {
    return (
      <div className="matcher">
        <div className="matcher-zone">
          {profiles[0] === undefined ? (
            <div className="img-container">
              <div className="error-db">
                <h1>
                  {context.user
                    ? "Please try again later"
                    : "Log in to use this feature"}
                </h1>
              </div>
            </div>
          ) : (
            <MatcherZone profile={profiles[Index]} />
          )}
          <LikeZone profiles={profiles} setIndex={setIndex} index={Index} />
        </div>
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
        <img src={info} alt=""></img>
        <h1>You must complete your profile info</h1>
      </div>
    );
  }
};

export default Matcher;
