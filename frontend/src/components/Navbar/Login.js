import React, { useContext, useState } from "react";
import { withRouter } from "react-router";
import { message, Form, Icon, Input, Button } from "antd";
import AuthContext from "../context/authContext";
import moment from "moment";

export default withRouter(props => {
  const [state, setState] = useState({ email: "", password: "" });
  const context = useContext(AuthContext);

  const handleAuthResponse = async res => {
    const resData = await res.json();
    if (res.ok) {
      context.login(
        {
          ...resData.user,
          age: moment().diff(resData.user.age, "years", false)
        },
        resData.token
      );
      props.history.push("/profiles");
    } else {
      message.error("Invalid credentials !");
      throw Error(res.status);
    }
  };

  const handleChange = e => {
    const name = e.target.name;
    const value = e.target.value;
    setState(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    const headers = {
      "Content-Type": "application/json",
      "Access-Control-Origin": "*"
    };
    fetch("/log/in", {
      method: "post",
      headers: headers,
      body: JSON.stringify(state)
    })
      .then(res => handleAuthResponse(res))
      .catch(e => console.log(e));
  };

  return (
    <form className="simple-form">
      <Form.Item>
        <Input
          prefix={<Icon type="mail" style={{ color: "rgba(0,0,0,.25)" }} />}
          name="email"
          placeholder="Email"
          onChange={handleChange}
        />
      </Form.Item>
      <Form.Item>
        <Input
          prefix={<Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />}
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
        />
      </Form.Item>
      <Form.Item>
        <Button onClick={handleSubmit}>Log in</Button>
      </Form.Item>
    </form>
  );
});
