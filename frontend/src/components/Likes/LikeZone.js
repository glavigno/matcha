// Libraries
import React, { useContext } from "react";

// Import component and css
import "./LikeZone.css";
import LikeButton from "../Likes/LikeButton";
import DislikeButton from "../Likes/DislikeButton";
import SocketContext from "../context/socketContext";
import AuthContext from "../context/authContext";

const LikeZone = props => {
  const context = useContext(AuthContext);
  const socket = useContext(SocketContext);
  const { profiles, index, setIndex } = props;

  const fetchLike = async obj => {
    await fetch("/like", {
      headers: { props: JSON.stringify(obj) }
    });
  };

  const fetchMatch = async obj => {
    if (
      profiles[index].isblocked === false &&
      profiles[index].isliked === true
    ) {
      await fetch("/match", {
        headers: { props: JSON.stringify(obj) }
      });
      /* ----- SOCKET ------------------------------------------------------------------------------------- */
      if (obj.interested === 1 && Object.keys(SocketContext).length > 0) {
        socket.emit("match", obj.likedUser, context.user.id);
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
            visited: obj.likedUser,
            visitor: context.user.firstname,
            visitorId: context.user.id,
            timestamp: require("moment")().format("MMMM Do, LT")
          })
        });
      }
    }
  };

  const handleLike = interest => {
    const obj = {
      likedUser: profiles[index].id,
      user: context.user.id,
      interested: interest
    };
    if (index !== profiles.length - 1) {
      const headers = {
        "Content-Type": "application/json",
        "Access-Control-Origin": "*"
      };
      fetchLike(obj);
      if (profiles[index].isblocked === false) {
        fetch("/notification", {
          method: "post",
          headers: headers,
          body: JSON.stringify({
            type: interest === 1 ? 3 : 4,
            visited: profiles[index].id,
            visitor: context.user.firstname,
            timestamp: require("moment")().format("MMMM Do, LT")
          })
        });
        fetch("/notification/score", {
          method: "post",
          headers: headers,
          body: JSON.stringify({
            type: interest === 1 ? 3 : 4,
            visited: profiles[index].id,
            score: profiles[index].score + interest === 1 ? 5 : -5
          })
        });
      }
      if (profiles[index].isblocked && Object.keys(SocketContext).length > 0) {
        socket.emit("likeUser", profiles[index].id, interest);
      }
      fetchMatch(obj);
      setIndex(index + 1);
    }
  };

  return (
    <div className="like-container">
      <DislikeButton
        aroundClass="circle-around"
        likeClass="fas fa-times fa-5x"
        handleLike={handleLike}
      />
      <LikeButton
        aroundClass="circle-around"
        likeClass="fas fa-heart fa-4x"
        handleLike={handleLike}
      />
    </div>
  );
};
export default LikeZone;
