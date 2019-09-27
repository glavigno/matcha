// Import packages
import React, { useContext, useEffect, useState } from "react";

// Import css files 
import "./Settings.css";
import { Modal } from "antd";

// Import child components
import Search from "./Search";
import Bio from "./Bio";
import Tags from "./Tags";
import Location from "./Location";
import NewPictures from "./NewPictures";
import Submit from "./Submit";

// Import contexts
import AuthContext from "../context/authContext";
import SettingsContext from "../context/settingsContext";

// Component 
export default props => {
  const context = useContext(AuthContext);
  const [state, setState] = useState({});

  useEffect(() => {
    let isSet = true;
    const fetchSettings = async () => {
      const res = await fetch(`/settings`, {
        headers: { user: context.user.id, token: context.token }
      });
      try {
        if (res) {
          if (res.status === 200) {
            const obj = await res.json();
            if (isSet) {
              setState({
                ...obj,
                city: context.user.city,
                latitude: context.user.latitude,
                longitude: context.user.longitude
              });
            }
          }
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchSettings();
    return () => isSet = false;
  }, [
    context.user.id,
    context.token,
    context.user.city,
    context.user.latitude,
    context.user.longitude
  ]);

  const handleChange = data => {
    const [key, value] = data;
    setState(prevState => ({ ...prevState, [key]: value }));
  };

  const handleLoc = data => {
    const [latitude, longitude] = data;
    setState(prevState => ({
      ...prevState,
      latitude: latitude,
      longitude: longitude
    }));
  };

  const handleTags = tags => {
    const tagsNames = Object.keys(tags);
    const activeTags = tagsNames.filter(checked => tags[checked]);
    setState(prevState => ({ ...prevState, tags: activeTags }));
  };

  const handlePictures = avatar => {
    setState(prevState => ({ ...prevState, avatar: avatar }));
  };

  const handleSubmit = () => {
    let isValid = true;
    for (let i in state) {
      if (
        ((i === "avatar" || i === "tags") && state[i] === null) ||
        state[i] === undefined ||
        state[i] === ""
      )
        isValid = false;
      else if (Array.isArray(state[i]) && !state[i].length) isValid = false;
    }
    if (isValid) {
      const headers = {
        "Content-Type": "application/json",
        "Access-Control-Origin": "*",
        token: context.token
      };

      fetch(`/settings`, {
        headers: headers,
        method: "post",
        body: JSON.stringify({ id: context.user.id, form: state })
      })
        .then(res => res.json())
        .then(data => {
          context.update(data);
        })
        .catch(error => console.log(error));
      props.cancelModal();
    } else {
      Modal.error({
        title: "Your profile is incomplete",
        content: "Fill all the fields to find love, please",
        centered: true
      });
    }
  };

  return (
    <div className="settings">
      <SettingsContext.Provider value={state}>
        <Search onInputChange={handleChange} />
        <Bio onInputChange={handleChange} />
        <Tags onInputChange={handleTags} />
        <Location onInputChange={handleChange} mapLoc={handleLoc} />
        <NewPictures onPicturesChange={handlePictures} />
        <Submit onButtonClick={handleSubmit} />
      </SettingsContext.Provider>
    </div>
  );
};
