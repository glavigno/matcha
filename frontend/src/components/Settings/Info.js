// Import packages
import React from "react";
import { Input, InputNumber, DatePicker } from "antd";

// Import css files
import "antd/dist/antd.css";

// Import contexts
import SettingsContext from "../context/settingsContext";

// Component
export default props => {
  const handleChange = e => {
    const key = e.target ? e.target.name : "userAge";
    const value = e.target ? e.target.value : e;
    props.onInputChange([key, value]);
  };

  return (
    <SettingsContext.Consumer>
      {context => (
        <div className="info">
          <h2>Info</h2>
          <div className="block">
            <h3 className="block__title">Login</h3>
            <Input
              name="login"
              value={context.initialState.login}
              onChange={handleChange}
            />
          </div>
          <div className="block">
            <h3 className="block__title">Firstname</h3>
            <Input
              name="firstname"
              value={context.initialState.firstname}
              onChange={handleChange}
            />
          </div>
          <div className="block">
            <h3 className="block__title">Lastname</h3>
            <Input
              name="lastname"
              value={context.initialState.lastname}
              onChange={handleChange}
            />
          </div>
          <div className="block">
            <h3 className="block__title">Age</h3>
            <InputNumber
              className="block__input"
              name="userAge"
              min={18}
              max={100}
              value={context.initialState.userAge || 30}
              onChange={handleChange}
            />
            {/* <DatePicker/> */}
          </div>
        </div>
      )}
    </SettingsContext.Consumer>
  );
};
