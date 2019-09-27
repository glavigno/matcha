// Libraries
import React from "react";
import error from "../../assets/static/svg/404.svg";

const ErrorPage = props => {
  const handleClick = () => {
    props.history.push("/");
  };
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <img style={{ width: "50%", height: "50%" }} src={error} alt=""></img>
      <p
        style={{
          fontSize: "2em",
          padding: "10px 20px",
          color: "white",
          background: "grey",
          borderRadius: "15px",
          margin: "25px 0 0 0"
        }}
        onClick={handleClick}
      >
        Go back to civilization
      </p>
    </div>
  );
};
export default ErrorPage;
