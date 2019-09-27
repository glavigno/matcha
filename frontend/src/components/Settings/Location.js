// Import packages
import React, { useContext, useState } from "react";

// Import css files
import "antd/dist/antd.css";

// Import child components
import { Button, Spin } from "antd";
import Map from "pigeon-maps";

// Import contexts
import AuthContext from "../context/authContext";
import SettingsContext from "../context/settingsContext";

// Component
export default props => {
  const parentContext = useContext(AuthContext);
  const [isLoading, setLoader] = useState(false);

  const showPosition = async position => {
    const obj = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lon=${position.coords.longitude}&lat=${position.coords.latitude}`
    );
    const data = await obj.json();
    props.onInputChange(["city", data.address.city]);
    props.mapLoc([parseFloat(data.lat), parseFloat(data.lon)]);
    setLoader(false);
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      setLoader(true);
      navigator.geolocation.getCurrentPosition(showPosition);
    } else {
      setLoader(false);
      console.log("Geolocation is not supported by this browser.");
    }
  };

  return (
    <SettingsContext.Consumer>
      {context => {
        return (
          <div className="location">
            <h2>Location</h2>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-evenly'}}>
              <div className="icons">
                <div className="icon">
                  {isLoading && <Spin size="large" />}
                  {!isLoading && (
                    <Button onClick={getLocation} icon="compass">
                      Get my location
                    </Button>
                  )}
                </div>
              </div>
              <div className="map">
                <Map
                  center={[
                    context.latitude || parentContext.user.latitude,
                    context.longitude || parentContext.user.longitude
                  ]}
                  zoom={13}
                />
              </div>
            </div>
          </div>
        );
      }}
    </SettingsContext.Consumer>
  );
};
