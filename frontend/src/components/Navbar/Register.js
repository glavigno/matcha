// Librairies
import React, { useState } from "react";

// Import components
import { Alert, message, Button, Input, Icon, DatePicker } from "antd";
import "antd/dist/antd.css";
import "./SimpleForm.css";

import moment from "moment";

export default props => {
  const [state, setState] = useState({
    login: "",
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    age: ""
  });

  const handleResponse = async res => {
    if (res.ok) {
      setState({});
      message.success("Welcome ! Check your mail box to confirm your account");
      props.onCancel();
    } else {
      message.warning("Error: missing fields or invalid info");
      throw Error(res.status);
    }
  };

  const handleChange = e => {
    const name = e.target.name;
    const value = e.target.value;
    setState(prevState => ({ ...prevState, [name]: value }));
  };

  const handleDate = e => {
    setState(prevState => ({ ...prevState, age: e }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    const headers = {
      "Content-Type": "application/json",
      "Access-Control-Origin": "*"
    };
    fetch("/registration", {
      method: "post",
      headers: headers,
      body: JSON.stringify(state)
    })
      .then(res => handleResponse(res))
      .catch(error => console.log(error));
  };

  return (
    <form className="simple-form">
      <Input
        name={"login"}
        value={state.login}
        placeholder={"Enter your login"}
        prefix={<Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />}
        onChange={handleChange}
      />
      <Input
        name={"email"}
        value={state.email}
        placeholder={"Enter your email"}
        prefix={<Icon type="mail" style={{ color: "rgba(0,0,0,.25)" }} />}
        onChange={handleChange}
      />
      <Input
        name={"firstName"}
        value={state.firstName}
        placeholder={"Enter your first name"}
        prefix={<Icon type="solution" style={{ color: "rgba(0,0,0,.25)" }} />}
        onChange={handleChange}
      />
      <Input
        name={"lastName"}
        value={state.lastName}
        placeholder={"Enter your last name"}
        prefix={<Icon type="solution" style={{ color: "rgba(0,0,0,.25)" }} />}
        onChange={handleChange}
      />
      <DatePicker
        onChange={handleDate}
        placeholder="Date of birth"
        format="YYYY/MM/DD"
        defaultPickerValue={moment("2000/01/01", "YYYY/MM/DD")}
      />
      <Alert
        closable
        message="If you are underage, we can't help you..."
        type="warning"
        showIcon
      />
      <Input.Password
        name={"password"}
        value={state.password}
        placeholder={"Enter your password"}
        prefix={<Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />}
        onChange={handleChange}
      />
      <Alert
        closable
        message="Minimum eight characters, at least one uppercase letter, one lowercase letter and one number"
        type="info"
        showIcon
      />
      <Button onClick={handleSubmit} block>
        Sign up
      </Button>
    </form>
  );
};
