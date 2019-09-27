// Import packages
import React from "react";

// Import css files
import "antd/dist/antd.css";

// Import child components
import { Slider, Select } from "antd";

// Import contexts
import SettingsContext from "../context/settingsContext";

// Component
export default props => {
  const { Option } = Select;

  const handleChange = (e, obj) => {
    const key = obj ? obj.props.title : "perimeter";
    const value = obj ? obj.props.value : e;
    props.onInputChange([key, value]);
  };

  const handleAgeRange = e => {
    props.onInputChange(["minage", e[0]]);
    props.onInputChange(["maxage", e[1]]);
  };

  return (
    <SettingsContext.Consumer>
      {context => (
        <div className="search">
          <h2>Search</h2>
          <div className="block">
            <h3 className="block__title">You are a</h3>
            <Select
              className="block__input"
              defaultValue="Male"
              value={context.gender}
              onChange={handleChange}
            >
              <Option title="gender" value={1}>
                Male
              </Option>
              <Option title="gender" value={2}>
                Female
              </Option>
            </Select>
          </div>
          <div className="block">
            <h3 className="block__title">Age range</h3>
            <Slider
              className="block__slider"
              name="ageRange"
              min={18}
              range
              defaultValue={[context.minage, context.maxage]}
              value={[context.minage, context.maxage]}
              onChange={handleAgeRange}
            />
          </div>
          <div className="block">
            <h3 className="block__title">Looking for</h3>
            <Select
              className="block__input"
              defaultValue="Both"
              value={context.orientation}
              onChange={handleChange}
            >
              <Option title="orientation" value={1}>
                Male
              </Option>
              <Option title="orientation" value={2}>
                Female
              </Option>
              <Option title="orientation" value={3}>
                Both
              </Option>
            </Select>
          </div>
          <div className="block">
            <h3 className="block__title">Perimeter (in km)</h3>
            <Slider
              max={1000}
              className="block__slider"
              defaultValue={100}
              value={context.perimeter}
              onChange={handleChange}
              step={50}
            />
          </div>
        </div>
      )}
    </SettingsContext.Consumer>
  );
};
