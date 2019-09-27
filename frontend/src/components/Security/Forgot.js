import React, { useState } from "react";

import { Button, Input, Icon } from "antd";

export default () => {
  const [email, setEmail] = useState("");
  const handleChange = e => {
    setEmail(e.target.value);
  };

  const handleKeyPress = e => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    const headers = {
      "Content-Type": "application/json",
      "Access-Control-Origin": "*"
    };
    fetch("/security/forgot", {
      headers: headers,
      method: "post",
      body: JSON.stringify({ email: email })
    });
  };

  return (
    <div className="security__block">
      <h1>Hello</h1>
      <Input
        name={"email"}
        placeholder={"Enter your email address"}
        prefix={<Icon type="mail" style={{ color: "rgba(0,0,0,.25)" }} />}
        onChange={handleChange}
        onKeyPress={handleKeyPress}
      />
      <Button onClick={handleSubmit}>Reset your password</Button>
    </div>
  );
};
