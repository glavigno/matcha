// Import packages
import React from "react";

// Import css files
import "antd/dist/antd.css";

// Import child components
import { Button } from "antd";

export default props => {
  return (
    <div className="submit">
      <Button block onClick={props.onButtonClick}>
        Save your settings
      </Button>
    </div>
  );
};
