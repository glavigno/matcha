// Libraries
import React from "react";
import eye from "../../assets/static/svg/eye.svg";
import moment from "moment";

// Import component and css
import "./MatcherZone.css";

const MatcherZone = fprops => {
  const { firstname, avatar } = fprops.profile;
  const age = moment().diff(fprops.profile.age, "years", false);

  return "endOfProfiles" in fprops.profile ? (
    <div className="img-container">
      <div className="error-db">
        <img src={eye} alt=""></img>
        <h1 style={{ textAlign: "center" }}>{fprops.profile.endOfProfiles}</h1>
      </div>
    </div>
  ) : (
    <div className="img-container">
      <img className="img-regular" src={avatar} alt="avatar" />
      <h1 className="img-name">{`${firstname}, ${age}`}</h1>
    </div>
  );
};

export default MatcherZone;
