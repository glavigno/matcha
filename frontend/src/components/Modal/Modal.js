// Libraires
import React, { useState, useEffect } from "react";
import { Transition, animated } from "react-spring/renderprops";

// Import components and css
import "./Modal.css";

const Modal = ({ toggle, toShow }) => {
  /* ------STATE VARIABLES ----------------------------------------------------------------- */

  const [show, setShow] = useState(true);

  return (
    <Transition
      native
      reset
      unique
      items={show}
      from={{ opacity: 0, transform: "translate3d(0, 100% ,0)" }}
      enter={{ opacity: 1, transform: "translate3d(0%, 0, 0)" }}
      leave={{ opacity: 0, transform: "translate3d(0, 100%, 0)" }}
    >
      {show => style => (
        <animated.div style={{ ...style }}>
          <div className="modal">
            <section className="modal-main">{toShow}</section>
          </div>
        </animated.div>
      )}
    </Transition>
  );
};

export default Modal;
