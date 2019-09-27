// Import packages
import React from "react";

// Import css files
import "antd/dist/antd.css";

// Import child components
import { Tag } from "antd";

export default props => {
  const { CheckableTag } = Tag;

  const handleChange = e => {
    props.onTagChange(props.value, e);
  };

  return (
    <CheckableTag checked={props.checked} onChange={handleChange}>
      {props.value}
    </CheckableTag>
  );
};
