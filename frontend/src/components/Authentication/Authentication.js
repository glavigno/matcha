import React, { useContext, useState } from "react";

import { Button, Input, Icon } from "antd";
import AuthContext from "../context/authContext";

import "./Authentication.css";

export default props => {
  const context = useContext(AuthContext);
  const [state, setState] = useState({
    email: "",
    password: "",
    key: window.location.pathname.split("/")[2]
  });

  const handleChange = e => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    const headers = {
      "Content-Type": "application/json",
      "Access-Control-Origin": "*"
    };

    fetch("/security/authentication", {
      method: "post",
      headers: headers,
      body: JSON.stringify(state)
    })
      .then(res => res.json())
      .then(data => {
        context.login(data.user, data.token);
        props.history.push("/profiles");
      })
      .catch(e => console.log(e));
  };
  return (
    <div className="auth__main">
      <Input
        name={"email"}
        placeholder={"Enter your email"}
        prefix={<Icon type="solution" style={{ color: "rgba(0,0,0,.25)" }} />}
        onChange={handleChange}
      />
      <Input
        type={"password"}
        name={"password"}
        placeholder={"Enter your password"}
        prefix={<Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />}
        onChange={handleChange}
      />
      <Button onClick={handleSubmit}>Confirm your account</Button>
    </div>
  );
};
