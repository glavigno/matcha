// Import packages
import React, { useState } from "react";

// Import css files
import Tag from "./ProfilesTag";

const stateTags = {
  outgoing: false,
  spontaneous: false,
  intelligent: false,
  passionate: false,
  affectionate: false,
  ambitious: false,
  sweet: false,
  creative: false,
  dumb: false
};

const tagsList = Object.keys(stateTags);

export default props => {
  const [tags, setTags] = useState(stateTags);

  const handleChange = (key, value) => {
    setTags(prevState => ({ ...prevState, [key]: value }));
    tags[key] = value;
    props.onChange(tagsList.filter(e => tags[e]));
  };

  const allTags = tagsList.map(elem => (
    <Tag
      onTagChange={handleChange}
      checked={tags[elem]}
      key={elem}
      value={elem}
    />
  ));

  return (
    <div className="tags">
      <div className="tags__area">{allTags}</div>
    </div>
  );
};
