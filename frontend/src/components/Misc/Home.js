// Libraries
import React from "react";

import { Carousel } from "antd";

import one from "../../assets/static/identity/one.png";
import two from "../../assets/static/identity/two.png";
import three from "../../assets/static/identity/three.png";
import four from "../../assets/static/identity/four.png";
import five from "../../assets/static/identity/five.png";
import six from "../../assets/static/identity/six.png";
import "../../App.css";
import "./Home.css";

export default () => {
  return (
    <div className="home__main">
      <Carousel dots={false} autoplay>
        <div sty={{ backGround: "black" }}>
          <img src={one} alt=""></img>
        </div>
        <div>
          <img src={two} alt=""></img>
        </div>
        <div>
          <img src={three} alt=""></img>
        </div>
      </Carousel>
      <span className="title">Love at first (web)sight</span>
      <Carousel dots={false} autoplay>
        <div sty={{ backGround: "black" }}>
          <img src={four} alt=""></img>
        </div>
        <div>
          <img src={five} alt=""></img>
        </div>
        <div>
          <img src={six} alt=""></img>
        </div>
      </Carousel>
    </div>
  );
};
