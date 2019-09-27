import React, { useState } from "react";

import { Alert, message, Button, Input, Icon } from "antd";

export default props => {
  const [info, setInfo] = useState({
    password: "",
    confirmation: "",
    key: props.match.params.key
  });

  const handleChange = e => {
    setInfo({ ...info, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    const headers = {
      "Content-Type": "application/json",
      "Access-Control-Origin": "*"
    };
    fetch(`/security/reset/${props.match.params.key}`, {
      headers: headers,
      method: "post",
      body: JSON.stringify(info)
    })
      .then(res => {
        if (res.status === 200) {
          message.success("Success ! Password has been reset");
          props.history.push("/");
        }
        else {
          message.warning("Error: Weak password or confirmation not matching");
          console.log('Error - Wrong password format and/or confirmation')
        } 
      })
      .catch(e => {
        console.log(e);
      })
  };

  return (
    <div className="security__block">
      <Input
        type={"password"}
        name={"password"}
        placeholder={"Enter your new password"}
        prefix={<Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />}
        onChange={handleChange}
      />
      <Input
        type={"password"}
        name={"confirmation"}
        placeholder={"Confirm your new password"}
        prefix={<Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />}
        onChange={handleChange}
      />
      <Alert
        style={{ marginTop: "15px" }}
        closable
        message="Minimum eight characters, at least one uppercase letter, one lowercase letter and one number"
        type="info"
        showIcon
      />
      <Button onClick={handleSubmit}>Reset your password</Button>
    </div>
  );
};
