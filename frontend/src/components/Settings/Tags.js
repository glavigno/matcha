// Import packages
import React, { useCallback, useContext, useEffect, useState } from "react";

// Import child components
import Tag from "./Tag";

// Import contexts
import SettingsContext from "../context/settingsContext";

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
  const [formatted, setFormatted] = useState([]);
  const context = useContext(SettingsContext);

  const handleChange = useCallback(
    (key, value) => {
      setTags(prevState => {
        props.onInputChange({ ...prevState, [key]: value });
        return { ...prevState, [key]: value };
      });
    },
    [props]
  );

  useEffect(() => {
    let isSet = true;
    if (isSet) {
      setFormatted(
        tagsList.map(elem => {
          let isChecked = context.tags ? context.tags.includes(elem) : false;
          tags[elem] = isChecked;
          return (
            <Tag
              onTagChange={handleChange}
              checked={isChecked}
              key={elem}
              value={elem}
            />
          );
        })
      );
    }
    return () => (isSet = false);
  }, [tags, context.tags, handleChange]);

  return (
    <div className="tags">
      <h2>Tags</h2>
      <div className="tags__area">{formatted}</div>
    </div>
  );
};
