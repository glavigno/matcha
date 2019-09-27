// Libraries
import React from "react";

// Import component and css
import "./LikeButton.css";

const DislikeButton = props => {
  const handleClick = () => {
    props.handleLike(0);
  };

  return (
    <button className={props.aroundClass} onClick={handleClick}>
      <i className={props.likeClass} />
    </button>
  );
};

export default DislikeButton;
