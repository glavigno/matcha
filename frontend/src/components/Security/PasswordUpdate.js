import React from "react";

import { Alert, Button, Input, Icon } from "antd";

export default props => {
  return (
    <div className="security__block">
      <Input
        type={"password"}
        name={"newPassword"}
        placeholder={"Enter your new password"}
        prefix={<Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />}
        onChange={props.onPasswordChange}
      />
      <Input
        type={"password"}
        name={"confirmation"}
        placeholder={"Confirm your new password"}
        prefix={<Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />}
        onChange={props.onPasswordChange}
      />
      <Alert
        style={{ marginTop: "15px" }}
        closable
        message="Minimum eight characters, at least one uppercase letter, one lowercase letter and one number"
        type="info"
        showIcon
      />
      <Button onClick={props.onSubmit}>Update your password</Button>
    </div>
  );
};
