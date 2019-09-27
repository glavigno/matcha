import React, { useCallback, useContext, useEffect, useState } from "react";
import SettingsContext from "../context/settingsContext";

import "./Settings.css";
import { Icon } from "antd";

const getBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

export default props => {
  const context = useContext(SettingsContext);
  const [pictures, setPictures] = useState([]);
  const [render, setRender] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleClick = useCallback(
    index => {
      const tmp = pictures[index];
      pictures.splice(index, 1);
      pictures.unshift(tmp);
      setPictures(pictures);
      props.onPicturesChange(pictures);
    },
    [pictures, props]
  );

  const handleCancel = useCallback(
    index => {
      pictures.splice(index, 1);
      setPictures(pictures);
      props.onPicturesChange(pictures);
    },
    [props, pictures]
  );

  useEffect(() => {
    let isSet = true;
    if (isSet) {
      if (context.avatar) {
        setPictures([...context.avatar]);
        setRender(
          context.avatar.map((e, index) => (
            <li key={index}>
              <img src={e} onClick={() => handleClick(index)} alt="" />
            </li>
          ))
        );
        setLoading(false);
      }
    }
    return () => (isSet = false);
  }, [context.avatar, handleClick]);

  useEffect(() => {
    let isSet = true;
    if (isSet) {
      setRender(
        pictures.map((e, index) => (
          <li key={index} className="preview">
          <img src={e} onClick={() => handleClick(index)} alt="" />
          <div className="img-icons">
            {!index && <Icon type="star" />}
            <Icon type="delete" onClick={() => handleCancel(index)} />
          </div>
        </li>
      ))
      );
      setLoading(false);
    }
    return () => isSet = false;
  }, [pictures, handleClick, handleCancel]);

  const handleChange = async e => {
    if (
      e.target.files[0].type === "image/jpeg" ||
      e.target.files[0].type === "image/png"
      ) {
        const img = await getBase64(e.target.files[0]);
      setPictures([...pictures, img]);
      props.onPicturesChange([...pictures, img]);
    }
  };

  if (!loading) {
    return (
      <div className="pics">
        <ul>{render}</ul>
        {pictures.length < 5 && (
          <div className="upload">
            <label htmlFor="file-input">
              <Icon type="upload" style={{ fontSize: "28px" }} />
            </label>
            <input
              id="file-input"
              type="file"
              onChange={handleChange}
              accept="image/png, image/jpeg"
            />
            <h5>Upload a picture</h5>
          </div>
        )}
      </div>
    );
  } else {
    return (
      <div className="pics">
        <Icon type="loading" style={{ fontSize: 24 }} spin />
      </div>
    );
  }
};
