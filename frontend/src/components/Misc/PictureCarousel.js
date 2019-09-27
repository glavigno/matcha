// Libraires
import React, { useState } from "react";

// Import components and css
import "../assets/css/Carousel.css";

const PictureCarousel = props => {
  /* ------STATE VARIABLES---------------------------------------------------------------- */

  return (
    <div className="carousel-container">
      <img className={props.class} src={props.url} onClick={props.onClick} />
    </div>
  );
};

export default PictureCarousel;
