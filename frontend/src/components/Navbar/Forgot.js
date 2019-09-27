import React, { useState } from "react";
import { Alert, Button, Input, Icon } from "antd";

export default () => {
  const [banner, setBanner] = useState(false);
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
    if (email) {
      setBanner(true);
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
    }
  };

  return (
    <div className="security__block">
      {banner && (
        <Alert
          message="Check your mail box to reset your password"
          type="success"
          closable
          showIcon
          onClose={() => setBanner(false)}
        />
      )}
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
