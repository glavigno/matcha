import React from "react";

import { Button, Input, Icon } from "antd";

export default props => {
  return (
    <div className="security__block">
      <Input
        name={"firstname"}
        placeholder={"Enter your firstname"}
        prefix={<Icon type="solution" style={{ color: "rgba(0,0,0,.25)" }} />}
        onChange={props.onInfoChange}
      />
      <Input
        name={"lastname"}
        placeholder={"Enter your lastname"}
        prefix={<Icon type="solution" style={{ color: "rgba(0,0,0,.25)" }} />}
        onChange={props.onInfoChange}
      />
      <Input
        name={"login"}
        placeholder={"Enter your new login"}
        prefix={<Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />}
        onChange={props.onInfoChange}
      />
      <Button onClick={props.onSubmit}>Update your info</Button>
    </div>
  );
};
