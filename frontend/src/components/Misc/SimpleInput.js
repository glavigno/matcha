// Librairies
import React from "react";

import "./SimpleInput.css";

function SimpleInput(props) {
  return (
    <div className="input-block">
      <label htmlFor={props.title}>{props.title}</label>
      <input
        type={props.type || "text"}
        id={props.name}
        name={props.name}
        placeholder={props.placeholder}
        onChange={props.onChange}
        value={props.value}
        required
      />
    </div>
  );
}

export default SimpleInput;
