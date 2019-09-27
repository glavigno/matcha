// Import packages
import React from "react";

// Import components
import SettingsContext from "../context/settingsContext";

// Component
export default props => {
  const handleChange = e => {
    const key = e.target.name;
    const value = e.target.value;
    props.onInputChange([key, value]);
  };

  return (
    <SettingsContext.Consumer>
      {context => (
        <div className="bio">
          <h2>Bio</h2>
          <textarea
            name="bio"
            placeholder="Tell us a bit more about yourself"
            onChange={handleChange}
            value={context.bio || ""}
          />
        </div>
      )}
    </SettingsContext.Consumer>
  );
};
