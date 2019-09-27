import React from "react";

import { Button, Input, Icon } from "antd";

export default props => {
  return (
    <div className="security__block">
      <Input
        name={"email"}
        placeholder={"Enter your new email address"}
        prefix={<Icon type="mail" style={{ color: "rgba(0,0,0,.25)" }} />}
        onChange={props.onMailChange}
      />
      <Button onClick={props.onSubmit}>Update your email address</Button>
    </div>
  );
};
