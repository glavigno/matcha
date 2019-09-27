import React, { useContext, useState } from "react";
import { withRouter } from "react-router";
import { Form, Icon, Input, Button } from "antd";
import AuthContext from "../context/authContext";
import { Link } from "react-router-dom";
import moment from "moment";

const HorizontalLoginForm = props => {
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
      alert(resData.message);
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
      .catch(error => console.log(error));
  };

  if (window.location.pathname.split("/")[1] === "authentication") {
    return 0;
  } else if (window.location.pathname !== "/registration") {
    return (
      <Form layout="inline" onSubmit={handleSubmit}>
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
          <Button htmlType="submit">Log in</Button>
        </Form.Item>
        <Form.Item>
          <Link to="/registration">
            <Button>Register</Button>
          </Link>
        </Form.Item>
        <Form.Item>
          <Link to="/security/forgot">
            <Button type="link" block>
              Forgot your password ?
            </Button>
          </Link>
        </Form.Item>
      </Form>
    );
  } else {
    return (
      <Link to="/">
        <Button type="link" block>
          Back to login page
        </Button>
      </Link>
    );
  }
};

const WrappedHorizontalLoginForm = Form.create({ name: "horizontal_login" })(
  HorizontalLoginForm
);

export default withRouter(WrappedHorizontalLoginForm);
