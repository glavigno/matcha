// Libraries
import React, { useState, useEffect, useContext } from "react";

// Import component and css
import "./ToggleLike.css";
import LikeButton from "../Likes/LikeButton";
import DislikeButton from "../Likes/DislikeButton";
import AuthContext from "../context/authContext";
import SocketContext from "../context/socketContext";

const ToggleLike = props => {
  const context = useContext(AuthContext);
  const socketContext = useContext(SocketContext);
  const { likedUserId, likedUserScore, isLiked, isBlocked } = props;
  const [toggle, setToggle] = useState(false);

  useEffect(() => {
    setToggle(props.Hasliked);
  }, [props.Hasliked]);

  const fetchLike = async obj => {
    await fetch("/like", {
      headers: { props: JSON.stringify(obj) }
    });
  };

  const fetchMatch = async obj => {
    if (isBlocked === false && isLiked) {
      await fetch("/match", {
        headers: { props: JSON.stringify(obj) }
      });
      /* ----- SOCKET ------------------------------------------------------------------------------------- */
      if (obj.interested === 1 && Object.keys(socketContext).length > 0) {
        socketContext.emit("match", likedUserId, context.user.id);
      }
      const headers = {
        "Content-Type": "application/json",
        "Access-Control-Origin": "*"
      };
      if (obj.interested === 1) {
        fetch("/notification", {
          method: "post",
          headers: headers,
          body: JSON.stringify({
            type: 1,
            visited: likedUserId,
            visitor: context.user.firstname,
            visitorId: context.user.id,
            timestamp: require("moment")().format("MMMM Do, LT")
          })
        });
      }
    }
  };

  const handleLike = interest => {
    /* ----- SOCKET --------------------------------------------------------------------------------------- */
    if (isBlocked === false && Object.keys(socketContext).length > 0) {
      socketContext.emit("likeUser", likedUserId, interest, context.user.id);
    }
    const headers = {
      "Content-Type": "application/json",
      "Access-Control-Origin": "*"
    };
    if (isBlocked === false) {
      fetch("/notification", {
        method: "post",
        headers: headers,
        body: JSON.stringify({
          type: interest === 1 ? 3 : 4,
          visited: likedUserId,
          visitor: context.user.firstname,
          timestamp: require("moment")().format("MMMM Do, LT")
        })
      });
      fetch("/notification/score", {
        method: "post",
        headers: headers,
        body: JSON.stringify({
          type: interest === 1 ? 3 : 4,
          visited: likedUserId,
          score: likedUserScore + interest === 1 ? 5 : -5
        })
      });
    }
    const obj = {
      likedUser: likedUserId,
      user: context.user.id,
      interested: interest,
      isLiked: isLiked
    };
    fetchLike(obj);
    fetchMatch(obj);
    setToggle(!toggle);
  };

  return (
    <div className="toggle-like-container">
      {toggle ? (
        <DislikeButton
          aroundClass="none-around"
          likeClass="fas fa-heart fa-3x red"
          handleLike={handleLike}
        />
      ) : (
        <LikeButton
          aroundClass="none-around"
          likeClass="far fa-heart fa-3x"
          handleLike={handleLike}
        />
      )}
    </div>
  );
};
export default ToggleLike;
