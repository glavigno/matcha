// Libraries
import React from "react";

// Import component and css
import "./LikeButton.css";

const LikeButton = props => {
  const handleClick = () => {
    props.handleLike(1);
  };

  return (
    <button className={props.aroundClass} onClick={handleClick}>
      <i className={props.likeClass} />
    </button>
  );
};

export default LikeButton;
